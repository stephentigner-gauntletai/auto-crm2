Noting here some tasks that need to be completed for the production launch.

---

When we added email notifications, Claude mentioned some configuration that needs to happen on production to enable that.

> For production deployment, you'll need to:
>
> 1. Deploy the Edge Function using `supabase functions deploy`
> 2. Set up the following environment variables in Supabase:
>    - `RESEND_API_KEY`: Your Resend API key
>    - `PUBLIC_SITE_URL`: Your production site URL
>    - `app.settings.edge_function_base_url`: Your production Edge Function URL
