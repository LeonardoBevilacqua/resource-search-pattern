
# Resource search pattern

This repository is a test to handle the limit of GET request, by creating a POST request to handle the resource search, generating an id, and a GET request to receive the id and apply the filter.
A collection for Bruno, a GitAPI client, is available in the repository.

## Key Benefits of this approach:
1. RESTful Semantics: POST creates a search resource, GET retrieves results;
1. Cacheability: The GET endpoint has proper cache headers;
1. Complex Queries: No URL length limitations for complex filters;
1. Stateless Results: The actual data fetching remains stateless and cacheable;
1. TTL Management: Automatic cleanup of old search resources.

## Production Considerations

1. Persistence: Replace the in-memory store with Redis or a database
1. Security: Add authentication and rate limiting
1. Validation: Add comprehensive validation for search queries
1. Monitoring: Add logging and metrics for search operations
1. Compression: Consider compressing large search queries before storage

This implementation should allow the ability to handle complex queries without violating REST principles.

