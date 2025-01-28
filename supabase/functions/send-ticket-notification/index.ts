// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Database } from '../../../lib/database.types.ts';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
	type: 'INSERT' | 'UPDATE' | 'DELETE';
	table: string;
	record: {
		id: string;
		title: string;
		description: string;
		status: string;
		created_by: string;
		assigned_to: string | null;
		team_id: string | null;
		created_at: string;
		updated_at: string;
		priority: string;
		internal_notes: string | null;
	};
	old_record: {
		id: string;
		title: string;
		description: string;
		status: string;
		created_by: string;
		assigned_to: string | null;
		team_id: string | null;
		created_at: string;
		updated_at: string;
		priority: string;
		internal_notes: string | null;
	} | null;
}

function getStatusLabel(status: string): string {
	switch (status) {
		case 'waiting_on_customer':
			return 'Waiting for Your Response';
		case 'in_progress':
			return 'Being Worked On';
		default:
			return status.replace(/_/g, ' ');
	}
}

serve(async (req) => {
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		const supabaseClient = createClient<Database>(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
		);

		const payload: WebhookPayload = await req.json();

		// Only process ticket updates
		if (payload.type !== 'UPDATE' || !payload.old_record) {
			return new Response(JSON.stringify({ message: 'Not a ticket update' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 200,
			});
		}

		// Get the customer's profile to check notification preferences
		const { data: customerProfile, error: customerError } = await supabaseClient
			.from('profiles')
			.select('email, email_notifications, ticket_update_notifications')
			.eq('id', payload.record.created_by)
			.single();

		if (customerError || !customerProfile) {
			throw new Error('Could not fetch customer profile');
		}

		// Check if the customer has enabled notifications
		if (!customerProfile.email_notifications || !customerProfile.ticket_update_notifications) {
			return new Response(
				JSON.stringify({ message: 'Customer has disabled notifications' }),
				{
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					status: 200,
				}
			);
		}

		// Determine what changed
		const changes: string[] = [];
		if (payload.record.status !== payload.old_record.status) {
			changes.push(
				`Status changed from "${getStatusLabel(
					payload.old_record.status
				)}" to "${getStatusLabel(payload.record.status)}"`
			);
		}
		if (payload.record.priority !== payload.old_record.priority) {
			changes.push(
				`Priority changed from "${payload.old_record.priority}" to "${payload.record.priority}"`
			);
		}
		if (payload.record.description !== payload.old_record.description) {
			changes.push('The ticket description was updated');
		}

		// Only send notification if there are relevant changes
		if (changes.length === 0) {
			return new Response(JSON.stringify({ message: 'No relevant changes' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 200,
			});
		}

		// Prepare email content
		const emailSubject = `Update to your ticket: ${payload.record.title}`;
		const emailContent = `
Hello,

Your support ticket has been updated:

${changes.join('\n')}

Ticket Details:
Title: ${payload.record.title}
Current Status: ${getStatusLabel(payload.record.status)}
Priority: ${payload.record.priority}

You can view the full ticket details here: ${Deno.env.get('PUBLIC_SITE_URL')}/tickets/${
			payload.record.id
		}

Best regards,
Your Support Team
		`.trim();

		// Send email using Resend
		const resendResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: 'support@resend.dev',
				to: customerProfile.email,
				subject: emailSubject,
				text: emailContent,
			}),
		});

		if (!resendResponse.ok) {
			throw new Error('Failed to send email');
		}

		return new Response(JSON.stringify({ message: 'Notification sent successfully' }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 200,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return new Response(JSON.stringify({ error: errorMessage }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 500,
		});
	}
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-ticket-notification' \
    --header 'Authorization: Bearer SUPABASE_ANON_KEY' \
    --header 'Content-Type: application/json' \
    --data '{"type":"UPDATE","table":"tickets","record":{"id":"..."},"old_record":{"id":"..."}}'

  Note: Replace SUPABASE_ANON_KEY with the anon key from your local Supabase instance.
*/
