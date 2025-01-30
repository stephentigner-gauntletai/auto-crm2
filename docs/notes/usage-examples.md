Claude gave me this usage example for our LangGraph CRM agent.

```javascript
// Initialize tools with user context
const tools = initializeTools(userId, userRole);

// Use in LangGraph agent
const agent = createAgent({
    tools,
    model,
    // ... other configuration
});

// Example usage
const result = await agent.invoke({
    input: "Create a new high priority ticket for customer support issue"
});
```
