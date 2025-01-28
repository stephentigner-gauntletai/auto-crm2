This was my first prommpt to generate the overall requirements for the system.

> We are creating a CRM system (like Zendesk). The overall requirements for phase one of the system are in @system-reqs.md. With technical requirements in @technical-reqs.md. Coding standards are in @standards.md . Given these documents, please give me suggestions on a core set of 3-5 features you think will be most important for an MVP. In this document the feature groups are third-level headers (###) starting with Employee Interface, and the features are fourth-level (####) with feature details underneath them.

Then I used this prompt to generate a project plan.

> Please make an overall project plan for these four features, with a list of deliverables for each. Please front load the items that will allow a basic bootstrapping of the system as soon as possible so that we can view and run what has been built as we work through it to make sure it is working and cohesive. Place that in markdown format in docs/plan/phase-one-plan.md

Then this prompt to start building the system.

> Let's start building. We'll go through the checklist you just created in the@phase-one-plan.md . Check off items as you complete them. DO NOT add or remove items without checking with me first. When working with supabase, make sure to follow the guidlines in @supabase-auth-guidelines.md and @supabase-create-migration.md.

A starter prompt for starting a new composer session (customize as needed):

> We're creating a CRM (like Zendesk) and are building out our MVP with the most important and basic features for now. The original client requirements are in @system-reqs.md , with technical requirements in @technical-reqs.md . Coding standards are in @standards.md . We have a checklist of tasks to complete located in @phase-one-plan.md .
