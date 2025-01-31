What I'd like to do is build an agent that can perform various tasks for us in the system. For now, this agent would be only used internally by staff members. Here are the kinds of tasks I'd like to perform:

* For Agents:
	* Create a new ticket
	* Edit the details of a ticket
		* This includes changing the title, description, assignee, status, priority, and other metadata
		* "Re-assigning" a ticket to a different agent or team would fall under this
	* Add comments to a ticket, with the option of marking it as an internal note
* For Admins I want everything an agent can do, plus:
	* Create a new user
	* Edit the details of a user
	* Create a new team
	* Edit the details of a team
	* Add agents to a team
	* Remove agents from a team

Each of these tasks should be a different tool call for the agent.
Each task should be encapsulated in a function that can be called by the agent.

---

Agent UI design

* Accessible via a link/button in the header
	* Only accesible to staff (agents and admins)
* Chat-based interface with history
* Each conversation is a new thread
* Ability to view past conversations that are still in memory
* Ability to start a new conversation
* User can request agent to perform any of the tasks our tools can perform that they have permission to do
* If the user doesn't have permission to do something, the agent should say so
* If there is not a tool that can do what the user wants, the agent should say so
	* But don't use the word "tool" in the response, just apologize and say something like "I don't know how to do that"

