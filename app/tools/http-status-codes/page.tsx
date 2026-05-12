'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Search, Globe, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface StatusCode {
  code: number
  name: string
  description: string
  useCase: string
  detailed: string
  causes: string[]
  troubleshooting: string[]
  exampleHeaders: string
  category: string
}

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'Server has received the request headers and the client should proceed to send the request body.', useCase: 'Large file uploads with Expect: 100-continue header', detailed: 'The server has received the request headers and is waiting for the client to send the request body. This is typically used when the client needs to send a large body and wants to confirm the server is willing to accept it before transmitting.', causes: ['Client sent an Expect: 100-continue header', 'Server acknowledges it is ready for the request body'], troubleshooting: ['Ensure the client sends the request body after receiving this response', 'Check if your HTTP client handles 100 Continue correctly'], exampleHeaders: 'HTTP/1.1 100 Continue\n\nServer: nginx/1.24', category: '1xx' },
  { code: 101, name: 'Switching Protocols', description: 'Server is switching protocols as requested by the client via Upgrade header.', useCase: 'WebSocket connections, HTTP/2 upgrade', detailed: 'Sent in response to a client\'s Upgrade header, indicating the server agrees to switch to a different protocol. Most commonly used to establish WebSocket connections.', causes: ['Client requested protocol upgrade via Upgrade header', 'Server supports the requested protocol'], troubleshooting: ['Verify the Upgrade header is correctly formatted', 'Ensure the server supports the requested protocol'], exampleHeaders: 'HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=', category: '1xx' },
  { code: 102, name: 'Processing', description: 'Server has received and is processing the request, but no response is available yet.', useCase: 'Long-running WebDAV operations', detailed: 'This interim response indicates that the server has accepted the complete request but has not yet completed it. Prevents the client from timing out while waiting for a long operation.', causes: ['Long-running server-side operation', 'WebDAV PROPFIND or similar operations on large collections'], troubleshooting: ['Ensure client has adequate timeout settings', 'Consider implementing progress tracking'], exampleHeaders: 'HTTP/1.1 102 Processing', category: '1xx' },
  { code: 103, name: 'Early Hints', description: 'Server returns some response headers before the final HTTP message.', useCase: 'Preloading resources (CSS, JS) while server prepares the full response', detailed: 'Used to return some response headers before the final HTTP message, primarily to allow the browser to start preloading resources while the server prepares the full response.', causes: ['Server sending preload hints for resources', 'Enabling faster page loads with resource hints'], troubleshooting: ['Check that Link headers are correctly formatted', 'Verify browser support for Early Hints'], exampleHeaders: 'HTTP/1.1 103 Early Hints\nLink: </style.css>; rel=preload; as=style\nLink: </script.js>; rel=preload; as=script', category: '1xx' },

  // 2xx Success
  { code: 200, name: 'OK', description: 'The request has succeeded.', useCase: 'Standard successful GET, POST, PUT responses', detailed: 'The standard response for successful HTTP requests. The meaning depends on the HTTP method: GET = resource fetched, POST = result of action, PUT/PATCH = resource modified.', causes: ['Request was processed successfully'], troubleshooting: ['No troubleshooting needed — this is a success response'], exampleHeaders: 'HTTP/1.1 200 OK\nContent-Type: application/json\nContent-Length: 42\nCache-Control: max-age=3600', category: '2xx' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled and a new resource has been created.', useCase: 'REST API POST creating a new resource', detailed: 'Returned when a new resource has been successfully created. The response should include a Location header pointing to the newly created resource and typically returns the created resource in the body.', causes: ['Successful POST request that created a resource', 'Successful PUT request to a collection URI'], troubleshooting: ['Verify the Location header is set correctly', 'Ensure the response body contains the created resource'], exampleHeaders: 'HTTP/1.1 201 Created\nLocation: /api/users/123\nContent-Type: application/json\n\n{"id": 123, "name": "John Doe"}', category: '2xx' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.', useCase: 'Asynchronous operations, job queues, batch processing', detailed: 'The request has been accepted but processing hasn\'t completed. This is typically used for async operations where the result may take time. The response may include a status URL for checking progress.', causes: ['Asynchronous job submitted successfully', 'Long-running operation accepted'], troubleshooting: ['Poll the status URL provided in the response', 'Implement webhook handling for completion notifications'], exampleHeaders: 'HTTP/1.1 202 Accepted\nLocation: /api/jobs/456/status\nRetry-After: 30', category: '2xx' },
  { code: 203, name: 'Non-Authoritative Information', description: 'The returned meta-information is from a local or third-party copy, not the origin server.', useCase: 'Proxy/CDN responses with modified headers', detailed: 'The response is a transformed version of the origin server\'s response, often from a proxy or cache. The 200 OK equivalent when the intermediary has modified the headers or payload.', causes: ['Response modified by a proxy server', 'CDN serving cached and transformed content'], troubleshooting: ['Check if a proxy is modifying your response headers', 'Compare with direct origin server response'], exampleHeaders: 'HTTP/1.1 203 Non-Authoritative Information', category: '2xx' },
  { code: 204, name: 'No Content', description: 'The server has fulfilled the request but does not need to return an entity-body.', useCase: 'Successful DELETE, PUT with no response body', detailed: 'Used when the request was successful but there is no data to return in the response body. Common for DELETE requests, PUT/PATCH where the client already has the updated state, or POST operations with no meaningful response.', causes: ['Successful DELETE request', 'Successful update where no response body is needed'], troubleshooting: ['Ensure the client handles empty response bodies correctly', 'This is a success status — no action needed'], exampleHeaders: 'HTTP/1.1 204 No Content\n\n(no body)', category: '2xx' },
  { code: 205, name: 'Reset Content', description: 'The server has fulfilled the request and the user agent should reset the document view.', useCase: 'Form reset after successful submission', detailed: 'Tells the client to reset the document view that caused the request to be sent. Useful after a form submission to clear the form fields.', causes: ['Server wants the client to clear form data', 'Post-submission UI reset requested'], troubleshooting: ['Ensure client-side form reset logic handles this status', 'Rarely used in modern web applications'], exampleHeaders: 'HTTP/1.1 205 Reset Content', category: '2xx' },
  { code: 206, name: 'Partial Content', description: 'The server has fulfilled the partial GET request for the resource.', useCase: 'Video streaming, range requests, download resumption', detailed: 'Used when the client requests a specific range of bytes using the Range header. Essential for video streaming, resuming downloads, and efficient resource loading.', causes: ['Client sent a Range header', 'Server supporting byte-range requests'], troubleshooting: ['Ensure Accept-Ranges header is present', 'Check Content-Range header format', 'Verify the requested range is valid'], exampleHeaders: 'HTTP/1.1 206 Partial Content\nContent-Range: bytes 0-999/8000\nContent-Length: 1000\nAccept-Ranges: bytes', category: '2xx' },
  { code: 207, name: 'Multi-Status', description: 'Conveys information about multiple resources in situations where multiple status codes might be appropriate.', useCase: 'WebDAV batch operations', detailed: 'Provides status for multiple independent operations in a single response. Each sub-response has its own status code, typically used in WebDAV PROPFIND with multiple resources.', causes: ['WebDAV operation affecting multiple resources', 'Batch operations with mixed results'], troubleshooting: ['Parse the multi-status XML body', 'Check individual status entries'], exampleHeaders: 'HTTP/1.1 207 Multi-Status\nContent-Type: application/xml', category: '2xx' },
  { code: 208, name: 'Already Reported', description: 'Members of a DAV binding have already been enumerated in a previous reply.', useCase: 'WebDAV recursive operations avoiding duplicates', detailed: 'Used to prevent enumerating the internal members of multiple bindings to the same collection repeatedly in a WebDAV response.', causes: ['Recursive WebDAV PROPFIND encountering already-reported resources'], troubleshooting: ['Ensure WebDAV client handles already-reported resources', 'Check for circular references in directory structure'], exampleHeaders: 'HTTP/1.1 208 Already Reported', category: '2xx' },
  { code: 226, name: 'IM Used', description: 'The server has fulfilled a GET request for the resource using instance manipulations.', useCase: 'Delta encoding responses', detailed: 'Indicates that the server has used instance manipulations (like delta encoding) to fulfill the request, returning only the differences from a previous response.', causes: ['Delta encoding applied to response', 'Client provided A-IM header for instance manipulation'], troubleshooting: ['Ensure the client supports the applied instance manipulation', 'Check A-IM and IM headers for compatibility'], exampleHeaders: 'HTTP/1.1 226 IM Used\nIM: feed\nDelta-Base: "/original"', category: '2xx' },

  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: 'The target resource has more than one representation, each with its own URI.', useCase: 'Content negotiation, language selection', detailed: 'The server offers multiple representations of the requested resource. The client should choose one via content negotiation or by selecting from the provided options.', causes: ['Multiple formats available for the resource', 'Content type negotiation needed'], troubleshooting: ['Use the Location header or body links to select a representation', 'Provide Accept headers to specify preferred format'], exampleHeaders: 'HTTP/1.1 300 Multiple Choices\nLocation: /resource.html', category: '3xx' },
  { code: 301, name: 'Moved Permanently', description: 'The target resource has been assigned a new permanent URI.', useCase: 'Domain migration, URL restructuring, HTTP to HTTPS redirect', detailed: 'The requested resource has been permanently moved to a new URL. Search engines and browsers will update their records. The new URL should be used for all future requests.', causes: ['URL structure changed permanently', 'Domain migration', 'HTTP to HTTPS redirect'], troubleshooting: ['Update all links to the new URL', 'Ensure the Location header points to the correct new URL', 'Maintain the redirect to preserve SEO value'], exampleHeaders: 'HTTP/1.1 301 Moved Permanently\nLocation: https://new-domain.com/page\nCache-Control: max-age=3600', category: '3xx' },
  { code: 302, name: 'Found', description: 'The target resource resides temporarily under a different URI.', useCase: 'Temporary redirects, login redirects, A/B testing', detailed: 'The resource is temporarily available at a different URL. Browsers should continue to use the original URL for future requests. Originally called "Moved Temporarily."', causes: ['Temporary page redirect', 'Maintenance redirect', 'A/B test routing'], troubleshooting: ['Ensure the redirect is actually temporary (use 301 for permanent)', 'Verify the Location header is correct'], exampleHeaders: 'HTTP/1.1 302 Found\nLocation: /temporary-page\nCache-Control: no-cache', category: '3xx' },
  { code: 303, name: 'See Other', description: 'The server is redirecting the user agent to a different resource via GET.', useCase: 'Redirect after POST (Post/Redirect/Get pattern)', detailed: 'After a POST request, the server redirects the client to a different resource using GET. This prevents duplicate submissions when the user refreshes the page.', causes: ['Post/Redirect/Get pattern implementation', 'Redirect to confirmation page after form submission'], troubleshooting: ['Ensure the redirect target uses GET method', 'Implement this pattern to prevent form resubmission'], exampleHeaders: 'HTTP/1.1 303 See Other\nLocation: /confirmation', category: '3xx' },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the last request.', useCase: 'Browser caching, conditional requests with ETag/If-None-Match', detailed: 'Indicates that the cached version is still valid. The client should use its cached copy. Requires conditional headers like If-None-Match or If-Modified-Since.', causes: ['Resource unchanged since last request', 'ETag matches', 'Last-Modified date unchanged'], troubleshooting: ['This is a successful cache hit — no action needed', 'Ensure proper cache headers are set for future requests'], exampleHeaders: 'HTTP/1.1 304 Not Modified\nETag: "abc123"\nCache-Control: max-age=86400', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', description: 'The target resource resides temporarily under a different URI, preserving the request method.', useCase: 'HTTPS redirect preserving POST data', detailed: 'Like 302 but guarantees the request method and body won\'t change. If the original request was POST, the redirect will also use POST with the same body.', causes: ['Temporary redirect that must preserve HTTP method', 'HTTP to HTTPS redirect for POST requests'], troubleshooting: ['Use 307 instead of 302 when you need to preserve the request method', 'Ensure the target server can handle the same HTTP method'], exampleHeaders: 'HTTP/1.1 307 Temporary Redirect\nLocation: https://secure.example.com/form\nCache-Control: no-cache', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', description: 'The target resource has been assigned a new permanent URI, preserving the request method.', useCase: 'API endpoint migration preserving method semantics', detailed: 'Like 301 but guarantees the request method and body won\'t change. Use when permanently moving an endpoint that handles POST/PUT/PATCH.', causes: ['Permanent URL change requiring method preservation', 'API version migration'], troubleshooting: ['Update API clients to use the new URL', 'Ensure the new endpoint handles all HTTP methods'], exampleHeaders: 'HTTP/1.1 308 Permanent Redirect\nLocation: /api/v2/resource', category: '3xx' },

  // 4xx Client Errors
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to client error.', useCase: 'Invalid JSON, missing required fields, malformed request', detailed: 'The request was malformed or invalid. Common causes include invalid JSON syntax, missing required parameters, or malformed headers.', causes: ['Invalid JSON in request body', 'Missing required parameters', 'Malformed URL or headers', 'Invalid content type'], troubleshooting: ['Validate request body against schema before sending', 'Check Content-Type header matches body format', 'Use request validation libraries', 'Review server logs for specific validation errors'], exampleHeaders: 'HTTP/1.1 400 Bad Request\nContent-Type: application/json\n\n{"error": "Invalid JSON syntax at position 42"}', category: '4xx' },
  { code: 401, name: 'Unauthorized', description: 'The request requires user authentication.', useCase: 'Missing or invalid API key, expired token, unauthenticated access', detailed: 'Authentication is required and has failed or has not been provided. The response should include a WWW-Authenticate header describing the authentication scheme.', causes: ['Missing Authorization header', 'Expired or invalid API key/token', 'Invalid credentials', 'OAuth token expired'], troubleshooting: ['Verify your API key is correct and not expired', 'Check Authorization header format', 'Refresh OAuth tokens before they expire', 'Ensure you\'re using the correct authentication scheme'], exampleHeaders: 'HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer realm="api"\nContent-Type: application/json\n\n{"error": "Invalid or expired API key"}', category: '4xx' },
  { code: 402, name: 'Payment Required', description: 'Reserved for future use. Intended for digital payment systems.', useCase: 'Paywalled content, API usage limits exceeded', detailed: 'Originally intended for digital payment/micropayment systems. Some APIs use this to indicate that payment is needed to access a resource or that usage limits have been exceeded.', causes: ['API credit limit exceeded', 'Subscription expired', 'Feature requires payment'], troubleshooting: ['Check your account balance/credits', 'Upgrade your subscription plan', 'Review billing details'], exampleHeaders: 'HTTP/1.1 402 Payment Required\nContent-Type: application/json\n\n{"error": "Credit limit exceeded. Please top up your account."}', category: '4xx' },
  { code: 403, name: 'Forbidden', description: 'The server understood the request but refuses to authorize it.', useCase: 'Insufficient permissions, IP blocked, rate limited', detailed: 'The client does not have permission to access the requested resource. Unlike 401, authentication won\'t help — the client is authenticated but not authorized.', causes: ['Insufficient permissions/role', 'IP address blocked', 'Resource access restricted', 'CORS policy blocking request', 'Rate limit exceeded'], troubleshooting: ['Verify your account has the required permissions', 'Check if your IP is blocked', 'Review CORS headers configuration', 'Check rate limit headers (Retry-After)'], exampleHeaders: 'HTTP/1.1 403 Forbidden\nContent-Type: application/json\n\n{"error": "You do not have permission to access this resource"}', category: '4xx' },
  { code: 404, name: 'Not Found', description: 'The server can not find the requested resource.', useCase: 'Broken links, deleted resources, incorrect API endpoints', detailed: 'The requested resource does not exist at the given URL. This could mean the resource was deleted, the URL is misspelled, or the endpoint has been moved without a redirect.', causes: ['Resource deleted or never existed', 'Incorrect URL/endpoint', 'API version changed', 'Typo in the URL'], troubleshooting: ['Verify the URL is correct', 'Check API documentation for correct endpoints', 'Search for the resource if it may have been moved', 'Check for trailing slashes or case sensitivity'], exampleHeaders: 'HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{"error": "Resource not found: /api/users/999"}', category: '4xx' },
  { code: 405, name: 'Method Not Allowed', description: 'The method received in the request-line is not supported by the target resource.', useCase: 'POST to a read-only endpoint, DELETE without permission', detailed: 'The HTTP method used is not supported for this resource. The response should include an Allow header listing the supported methods.', causes: ['Using POST on a GET-only endpoint', 'Using DELETE on a read-only resource', 'Incorrect HTTP method for the operation'], troubleshooting: ['Check the Allow header for supported methods', 'Review API documentation for correct method usage', 'Verify the endpoint supports the method you\'re using'], exampleHeaders: 'HTTP/1.1 405 Method Not Allowed\nAllow: GET, HEAD, OPTIONS\nContent-Type: application/json', category: '4xx' },
  { code: 406, name: 'Not Acceptable', description: 'The server cannot produce a response matching the Accept headers.', useCase: 'Client requests unsupported content type', detailed: 'The server cannot return data in any of the formats specified by the client\'s Accept header. The client needs to accept a format the server can produce.', causes: ['Accept header requests unsupported format', 'Server cannot produce requested content type'], troubleshooting: ['Add application/json to Accept header', 'Remove overly restrictive Accept headers', 'Check what content types the API supports'], exampleHeaders: 'HTTP/1.1 406 Not Acceptable\nContent-Type: application/json\n\n{"error": "Cannot produce response in format: text/csv"}', category: '4xx' },
  { code: 407, name: 'Proxy Authentication Required', description: 'The client must authenticate itself with the proxy.', useCase: 'Corporate proxy requiring authentication', detailed: 'Similar to 401 but authentication is needed for a proxy server between the client and the origin server.', causes: ['Proxy server requires authentication', 'Missing proxy credentials'], troubleshooting: ['Configure proxy authentication in your HTTP client', 'Check with network admin for proxy credentials'], exampleHeaders: 'HTTP/1.1 407 Proxy Authentication Required\nProxy-Authenticate: Basic realm="proxy"', category: '4xx' },
  { code: 408, name: 'Request Timeout', description: 'The server did not receive a complete request message within the time it was prepared to wait.', useCase: 'Slow client connection, upload timeout', detailed: 'The client took too long to send the request. The server closed the connection. This can happen with slow uploads or network issues.', causes: ['Client connection too slow', 'Network latency issues', 'Upload too large for timeout setting'], troubleshooting: ['Increase client timeout settings', 'Check network connectivity', 'Reduce upload size or implement chunked uploads'], exampleHeaders: 'HTTP/1.1 408 Request Timeout\nConnection: close', category: '4xx' },
  { code: 409, name: 'Conflict', description: 'The request could not be completed due to a conflict with the current state of the target resource.', useCase: 'Duplicate resource creation, version conflicts, concurrent edits', detailed: 'The request conflicts with the current state of the server. Common in REST APIs when trying to create a duplicate resource or update a resource that has been modified by another client.', causes: ['Duplicate unique key/identifier', 'Optimistic locking conflict', 'Resource already exists', 'Concurrent modification'], troubleshooting: ['Check for existing resources before creating', 'Implement optimistic concurrency with ETags', 'Use PUT with If-Match header for conflict detection'], exampleHeaders: 'HTTP/1.1 409 Conflict\nContent-Type: application/json\n\n{"error": "User with email john@example.com already exists"}', category: '4xx' },
  { code: 410, name: 'Gone', description: 'The target resource is no longer available and no forwarding address is known.', useCase: 'Permanently deleted resources, discontinued APIs', detailed: 'The resource is permanently gone, unlike 404 which may be temporary. Used when the resource existed but was intentionally removed and there\'s no replacement.', causes: ['Resource permanently deleted', 'API endpoint deprecated and removed', 'Content purged'], troubleshooting: ['Check API changelog for replacement endpoints', 'Remove references to this resource', 'This is permanent — the resource will not return'], exampleHeaders: 'HTTP/1.1 410 Gone\nContent-Type: application/json\n\n{"error": "This API version has been permanently retired"}', category: '4xx' },
  { code: 411, name: 'Length Required', description: 'The server refuses to accept the request without a defined Content-Length.', useCase: 'POST/PUT requests missing Content-Length header', detailed: 'The server requires a Content-Length header in the request. The client must include it to indicate the size of the request body.', causes: ['Missing Content-Length header', 'Transfer-Encoding not used as alternative'], troubleshooting: ['Add Content-Length header to the request', 'Use chunked Transfer-Encoding as an alternative'], exampleHeaders: 'HTTP/1.1 411 Length Required\n\nContent-Length header is required.', category: '4xx' },
  { code: 412, name: 'Precondition Failed', description: 'One or more conditions given in the request header fields evaluated to false.', useCase: 'Conditional update with ETag, If-Unmodified-Since check', detailed: 'A precondition specified in the request headers (If-Match, If-Unmodified-Since, etc.) evaluated to false. Common for optimistic concurrency control.', causes: ['ETag in If-Match header doesn\'t match current resource', 'If-Unmodified-Since date is before last modification', 'Resource was modified by another client'], troubleshooting: ['Fetch the latest resource state and retry', 'Update the ETag in your conditional header', 'Implement proper retry logic for concurrent modifications'], exampleHeaders: 'HTTP/1.1 412 Precondition Failed\nETag: "v2-new"\n\nResource has been modified since your last read.', category: '4xx' },
  { code: 413, name: 'Payload Too Large', description: 'The request payload is larger than the server is willing or able to process.', useCase: 'File upload too large, request body exceeds limit', detailed: 'The request body exceeds the server\'s configured maximum size. The client should reduce the payload size or the server should increase its limit.', causes: ['File upload exceeds server limit', 'Request body too large', 'Server configuration limits exceeded'], troubleshooting: ['Reduce the file size before uploading', 'Check server\'s max body size configuration', 'Implement chunked upload for large files'], exampleHeaders: 'HTTP/1.1 413 Payload Too Large\nContent-Type: application/json\n\n{"error": "Request body exceeds 10MB limit"}', category: '4xx' },
  { code: 414, name: 'URI Too Long', description: 'The request-target is longer than the server is willing to interpret.', useCase: 'Excessively long URL with many query parameters', detailed: 'The URL is too long for the server to process. This can happen with excessive query parameters or encoded data in the URL.', causes: ['URL with too many query parameters', 'Data encoded in URL instead of request body', 'Deeply nested path segments'], troubleshooting: ['Move data from URL to request body', 'Reduce query parameters', 'Use POST instead of GET for large data'], exampleHeaders: 'HTTP/1.1 414 URI Too Long', category: '4xx' },
  { code: 415, name: 'Unsupported Media Type', description: 'The origin server refuses the request because the payload is in an unsupported format.', useCase: 'Sending XML when API expects JSON, wrong Content-Type', detailed: 'The server does not support the media type of the request body (Content-Type header) or the Accept header specifies an unsupported format.', causes: ['Wrong Content-Type header', 'Server doesn\'t support the media type', 'Missing charset in Content-Type'], troubleshooting: ['Set Content-Type to application/json', 'Check API docs for supported content types', 'Include charset: utf-8 in Content-Type'], exampleHeaders: 'HTTP/1.1 415 Unsupported Media Type\nContent-Type: application/json\n\n{"error": "Expected Content-Type: application/json, received: text/plain"}', category: '4xx' },
  { code: 416, name: 'Range Not Satisfiable', description: 'None of the ranges in the Range header field overlap the current extent of the selected resource.', useCase: 'Invalid byte range in download request', detailed: 'The requested byte range cannot be satisfied, either because it\'s beyond the resource size or the resource doesn\'t support range requests.', causes: ['Requested range exceeds file size', 'Invalid range format', 'Resource size changed between requests'], troubleshooting: ['Check Content-Length header for valid range', 'Ensure the range values are correct', 'Re-fetch the resource to get current size'], exampleHeaders: 'HTTP/1.1 416 Range Not Satisfiable\nContent-Range: bytes */8000', category: '4xx' },
  { code: 417, name: 'Expectation Failed', description: 'The expectation given in the Expect request header could not be met by the server.', useCase: 'Expect header not supported', detailed: 'The server cannot meet the expectation specified in the Expect request header.', causes: ['Server doesn\'t support the Expect header', '100-continue not supported'], troubleshooting: ['Remove the Expect header from the request', 'Use a different approach for large uploads'], exampleHeaders: 'HTTP/1.1 417 Expectation Failed', category: '4xx' },
  { code: 418, name: "I'm a Teapot", description: 'The server refuses to brew coffee because it is, permanently, a teapot.', useCase: 'Easter egg, playful APIs, non-coffee brewing devices', detailed: 'This code was defined in RFC 2324 (Hyper Text Coffee Pot Control Protocol) as an April Fools\' joke in 1998. Some APIs use it humorously or as a way to indicate that a service is not designed for a particular purpose.', causes: ['Attempting to brew coffee with a teapot', 'Easter egg endpoint', 'Deliberate API refusal'], troubleshooting: ['Use a coffee pot instead of a teapot', 'Check if the endpoint supports your intended operation'], exampleHeaders: 'HTTP/1.1 418 I\'m a Teapot\n\nThe server is a teapot and cannot brew coffee.', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', description: 'The server understands the content type and syntax but was unable to process the instructions.', useCase: 'Valid JSON but semantically incorrect (e.g., invalid email format)', detailed: 'The request is syntactically correct but semantically wrong. Unlike 400 (bad syntax), the server understands the format but the data fails business rules or validation.', causes: ['Invalid field values (e.g., "abc" for a number field)', 'Business rule violation', 'Referential integrity failure'], troubleshooting: ['Validate all fields against API schema', 'Check error response for specific field errors', 'Review API documentation for field constraints'], exampleHeaders: 'HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{"errors": [{"field": "email", "message": "Invalid email format"}]}', category: '4xx' },
  { code: 425, name: 'Too Early', description: 'The server is unwilling to risk processing a request that might be replayed.', useCase: 'TLS 1.3 early data (0-RTT) replay protection', detailed: 'Used to indicate that the server is unwilling to process a request that might be a replay of a previous request sent with TLS early data (0-RTT).', causes: ['Request sent with TLS 0-RTT', 'Server not configured for early data'], troubleshooting: ['Retry the request without early data', 'Configure TLS properly'], exampleHeaders: 'HTTP/1.1 425 Too Early\nRetry-After: 1', category: '4xx' },
  { code: 426, name: 'Upgrade Required', description: 'The server refuses to perform the request using the current protocol.', useCase: 'Requiring TLS/HTTPS, protocol upgrade', detailed: 'The server requires the client to upgrade to a different protocol. Common for requiring HTTPS or a newer HTTP version.', causes: ['Server requires HTTPS', 'Protocol upgrade needed'], troubleshooting: ['Switch to HTTPS', 'Upgrade your HTTP client protocol version'], exampleHeaders: 'HTTP/1.1 426 Upgrade Required\nUpgrade: TLS/1.2\nConnection: Upgrade', category: '4xx' },
  { code: 428, name: 'Precondition Required', description: 'The origin server requires the request to be conditional.', useCase: 'Requiring If-Match for PUT/PATCH to prevent lost updates', detailed: 'The server requires conditional request headers (like If-Match) to prevent accidental overwrites. This protects against the lost update problem.', causes: ['Missing If-Match or If-Unmodified-Since header', 'Server requires optimistic locking'], troubleshooting: ['Include If-Match header with the current ETag', 'Fetch the resource first to get its ETag', 'Use If-Unmodified-Since as an alternative'], exampleHeaders: 'HTTP/1.1 428 Precondition Required\n\nIf-Match header is required for this request.', category: '4xx' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.', useCase: 'API rate limiting, abuse prevention', detailed: 'The client has exceeded the rate limit. The response should include a Retry-After header indicating how long to wait before making another request.', causes: ['Rate limit exceeded', 'Too many API calls in a short time', 'Automated script exceeding quotas'], troubleshooting: ['Check Retry-After header for when to retry', 'Implement exponential backoff', 'Review your API usage and optimize calls', 'Consider upgrading your API plan for higher limits'], exampleHeaders: 'HTTP/1.1 429 Too Many Requests\nRetry-After: 60\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1700000000', category: '4xx' },
  { code: 431, name: 'Request Header Fields Too Large', description: 'The server is unwilling to process the request because its header fields are too large.', useCase: 'Excessively large cookies, too many headers', detailed: 'The total size of request headers exceeds the server\'s limit. This can happen with very large cookies or numerous header fields.', causes: ['Excessively large cookies', 'Too many header fields', 'Header values too long'], troubleshooting: ['Reduce cookie sizes', 'Minimize custom headers', 'Clear browser cookies if too large'], exampleHeaders: 'HTTP/1.1 431 Request Header Fields Too Large', category: '4xx' },
  { code: 451, name: 'Unavailable For Legal Reasons', description: 'The server is denying access to the resource as a consequence of a legal demand.', useCase: 'Government censorship, copyright takedowns, GDPR compliance', detailed: 'The resource is unavailable due to legal requirements, such as government censorship, court orders, or regulatory compliance. The response should include a Link header pointing to the relevant legal document.', causes: ['Government/legal takedown order', 'Copyright complaint', 'GDPR compliance requirement', 'Court-ordered content removal'], troubleshooting: ['Check the Link header for legal documentation', 'Consult legal counsel if you believe this is in error', 'Implement geo-restrictions if required by law'], exampleHeaders: 'HTTP/1.1 451 Unavailable For Legal Reasons\nLink: <https://example.com/legal/takedown-123>; rel="blocked-by"', category: '4xx' },

  // 5xx Server Errors
  { code: 500, name: 'Internal Server Error', description: 'The server encountered an unexpected condition that prevented it from fulfilling the request.', useCase: 'Unhandled exceptions, code bugs, server misconfiguration', detailed: 'A generic error indicating something went wrong on the server. This is the catch-all for unexpected server-side failures. Should return minimal details to the client for security.', causes: ['Unhandled exception in application code', 'Database connection failure', 'Configuration error', 'Memory/resource exhaustion'], troubleshooting: ['Check server application logs for stack traces', 'Verify database connectivity', 'Check server resource usage', 'Review recent deployments for regressions'], exampleHeaders: 'HTTP/1.1 500 Internal Server Error\nContent-Type: application/json\n\n{"error": "Internal server error", "request_id": "req_abc123"}', category: '5xx' },
  { code: 501, name: 'Not Implemented', description: 'The server does not support the functionality required to fulfill the request.', useCase: 'Unsupported HTTP method, unimplemented feature', detailed: 'The server doesn\'t support the requested HTTP method or feature. Different from 405 which means the method is not allowed for this specific resource.', causes: ['HTTP method not implemented by server', 'Feature not yet built', 'Protocol version not supported'], troubleshooting: ['Check if the HTTP method is supported', 'Review API documentation', 'Contact the API provider for feature availability'], exampleHeaders: 'HTTP/1.1 501 Not Implemented\nContent-Type: application/json', category: '5xx' },
  { code: 502, name: 'Bad Gateway', description: 'The server, while acting as a gateway or proxy, received an invalid response from an upstream server.', useCase: 'Reverse proxy can\'t reach backend, upstream server down', detailed: 'The proxy/gateway received an invalid response from the upstream server. This usually means the backend service is down, misconfigured, or returning malformed responses.', causes: ['Upstream server is down', 'Upstream server returning malformed responses', 'Network connectivity issue between proxy and upstream', 'DNS resolution failure for upstream'], troubleshooting: ['Check if the upstream server is running', 'Verify network connectivity between proxy and upstream', 'Check upstream server logs', 'Verify DNS resolution for the upstream hostname'], exampleHeaders: 'HTTP/1.1 502 Bad Gateway\n\nBad Gateway: The upstream server returned an invalid response.', category: '5xx' },
  { code: 503, name: 'Service Unavailable', description: 'The server is currently unable to handle the request due to temporary overloading or maintenance.', useCase: 'Server maintenance, overloaded service, circuit breaker open', detailed: 'The server is temporarily unable to handle requests. This could be due to maintenance, overload, or the server being in a degraded state. Should include a Retry-After header.', causes: ['Planned maintenance', 'Server overloaded', 'Circuit breaker triggered', 'Dependency service unavailable'], troubleshooting: ['Check Retry-After header for when to retry', 'Implement exponential backoff in client', 'Monitor server status page for maintenance windows', 'Check if the service is overloaded'], exampleHeaders: 'HTTP/1.1 503 Service Unavailable\nRetry-After: 300\nContent-Type: application/json\n\n{"error": "Service temporarily unavailable. Please retry after 5 minutes."}', category: '5xx' },
  { code: 504, name: 'Gateway Timeout', description: 'The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.', useCase: 'Upstream server too slow, proxy timeout', detailed: 'The proxy/gateway timed out waiting for a response from the upstream server. The upstream server may be running but taking too long to respond.', causes: ['Upstream server processing too slowly', 'Complex database queries', 'Network latency between proxy and upstream', 'Upstream server deadlocked'], troubleshooting: ['Increase proxy timeout settings', 'Optimize slow backend operations', 'Check database query performance', 'Implement async processing for long operations'], exampleHeaders: 'HTTP/1.1 504 Gateway Timeout\n\nGateway Timeout: The upstream server did not respond in time.', category: '5xx' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'The server does not support the major version of HTTP that was used in the request.', useCase: 'HTTP/0.9 request, unsupported HTTP version', detailed: 'The server doesn\'t support the HTTP protocol version used in the request.', causes: ['Client using unsupported HTTP version', 'Misconfigured HTTP version negotiation'], troubleshooting: ['Use HTTP/1.1 or HTTP/2', 'Update your HTTP client library', 'Check proxy/server HTTP version configuration'], exampleHeaders: 'HTTP/1.1 505 HTTP Version Not Supported', category: '5xx' },
  { code: 506, name: 'Variant Also Negotiates', description: 'Transparent content negotiation for the request results in a circular reference.', useCase: 'Misconfigured content negotiation', detailed: 'The server has a configuration error in transparent content negotiation that causes a circular reference.', causes: ['Server content negotiation misconfiguration', 'Circular variant references'], troubleshooting: ['Fix server content negotiation configuration', 'Check variant negotiation algorithm'], exampleHeaders: 'HTTP/1.1 506 Variant Also Negotiates', category: '5xx' },
  { code: 507, name: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request.', useCase: 'WebDAV disk full, storage quota exceeded', detailed: 'The server has run out of storage space. Common in WebDAV environments but applicable to any server that needs to store data.', causes: ['Disk space exhausted', 'Storage quota exceeded', 'Database storage full'], troubleshooting: ['Free up disk space on the server', 'Increase storage quota', 'Clean up old/temporary files'], exampleHeaders: 'HTTP/1.1 507 Insufficient Storage\nContent-Type: application/json\n\n{"error": "Storage quota exceeded"}', category: '5xx' },
  { code: 508, name: 'Loop Detected', description: 'The server detected an infinite loop while processing the request.', useCase: 'WebDAV recursive operations, circular symlinks', detailed: 'The server detected that processing the request would result in an infinite loop. Common in WebDAV with circular directory references.', causes: ['Circular directory references', 'Infinite redirect loop', 'Recursive operation on cyclic structure'], troubleshooting: ['Check for circular references in your resources', 'Remove circular symlinks', 'Break the reference cycle'], exampleHeaders: 'HTTP/1.1 508 Loop Detected', category: '5xx' },
  { code: 510, name: 'Not Extended', description: 'Further extensions to the request are required for the server to fulfill it.', useCase: 'Missing required request extension', detailed: 'The server requires additional request extensions to process the request. The client should add the required extensions.', causes: ['Missing required request extension header', 'Server policy requires additional headers'], troubleshooting: ['Check the response for required extensions', 'Add the necessary extension headers to the request'], exampleHeaders: 'HTTP/1.1 510 Not Extended', category: '5xx' },
  { code: 511, name: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access.', useCase: 'Captive portals, Wi-Fi login pages, hotel networks', detailed: 'The client needs to authenticate with the network (not the server) before making requests. Common with captive portals in hotels, airports, and coffee shops.', causes: ['Captive portal intercepting requests', 'Network requires authentication', 'Wi-Fi login required'], troubleshooting: ['Complete the network authentication/login', 'Open a browser to trigger the captive portal', 'Check if you need to accept network terms'], exampleHeaders: 'HTTP/1.1 511 Network Authentication Required\n\nNetwork login required. Please open a browser to authenticate.', category: '5xx' },
]

const CATEGORIES = [
  { key: '1xx', label: '1xx Informational', color: 'bg-blue-100 text-blue-800' },
  { key: '2xx', label: '2xx Success', color: 'bg-green-100 text-green-800' },
  { key: '3xx', label: '3xx Redirection', color: 'bg-yellow-100 text-yellow-800' },
  { key: '4xx', label: '4xx Client Error', color: 'bg-red-100 text-red-800' },
  { key: '5xx', label: '5xx Server Error', color: 'bg-orange-100 text-orange-800' },
]

function getCategoryIcon(code: number) {
  if (code < 200) return <Info className="w-4 h-4 text-blue-500" />
  if (code < 300) return <CheckCircle className="w-4 h-4 text-green-500" />
  if (code < 400) return <ChevronRight className="w-4 h-4 text-yellow-500" />
  if (code < 500) return <AlertTriangle className="w-4 h-4 text-red-500" />
  return <XCircle className="w-4 h-4 text-orange-500" />
}

function getStatusColor(code: number) {
  if (code < 200) return 'border-l-blue-500'
  if (code < 300) return 'border-l-green-500'
  if (code < 400) return 'border-l-yellow-500'
  if (code < 500) return 'border-l-red-500'
  return 'border-l-orange-500'
}

export default function HttpStatusCodesPage() {
  const [search, setSearch] = useState('')
  const [expandedCode, setExpandedCode] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  const filteredCodes = useMemo(() => {
    return STATUS_CODES.filter(sc => {
      const matchesSearch = search === '' ||
        sc.code.toString().includes(search) ||
        sc.name.toLowerCase().includes(search.toLowerCase()) ||
        sc.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !filterCategory || sc.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [search, filterCategory])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#17457c] mb-2 flex items-center gap-3">
          <Globe className="w-8 h-8" />
          HTTP Status Code Reference
        </h1>
        <p className="text-gray-600">
          Complete reference for all HTTP status codes with descriptions, common causes, troubleshooting tips, and example headers.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, or description..."
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${!filterCategory ? 'bg-[#17457c] text-white border-[#17457c]' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            All ({STATUS_CODES.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(filterCategory === cat.key ? null : cat.key)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${filterCategory === cat.key ? 'bg-[#17457c] text-white border-[#17457c]' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {cat.label} ({STATUS_CODES.filter(s => s.category === cat.key).length})
            </button>
          ))}
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {CATEGORIES.map(cat => (
          <div key={cat.key} className={`rounded-lg border p-3 text-center ${cat.color}`}>
            <p className="text-lg font-bold">{STATUS_CODES.filter(s => s.category === cat.key).length}</p>
            <p className="text-xs font-medium">{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Status Code List */}
      <div className="space-y-2">
        {filteredCodes.map(sc => (
          <div key={sc.code} className={`rounded-lg border border-l-4 ${getStatusColor(sc.code)} bg-white transition-all`}>
            <button
              onClick={() => setExpandedCode(expandedCode === sc.code ? null : sc.code)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 shrink-0">
                {getCategoryIcon(sc.code)}
                <span className="text-lg font-bold font-mono text-[#17457c] w-12">{sc.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{sc.name}</p>
                <p className="text-xs text-gray-500 truncate">{sc.description}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expandedCode === sc.code ? 'rotate-180' : ''}`} />
            </button>

            {expandedCode === sc.code && (
              <div className="border-t p-4 space-y-4 bg-gray-50/50">
                <div>
                  <h4 className="text-sm font-semibold text-[#17457c] mb-1">Description</h4>
                  <p className="text-sm text-gray-700">{sc.detailed}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#17457c] mb-1">Common Use Case</h4>
                  <p className="text-sm text-gray-700">{sc.useCase}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#17457c] mb-2">Common Causes</h4>
                    <ul className="space-y-1">
                      {sc.causes.map((cause, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="text-red-400 mt-0.5">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#17457c] mb-2">Troubleshooting</h4>
                    <ul className="space-y-1">
                      {sc.troubleshooting.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#17457c] mb-2">Example Response Headers</h4>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      <code>{sc.exampleHeaders}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredCodes.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No status codes match your search</p>
          </div>
        )}
      </div>

      {/* API Integration Section */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-lg text-[#17457c] flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Check HTTP Statuses Programmatically
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Use the <strong>Scrape API</strong> to check HTTP status codes of any URL programmatically. Perfect for monitoring, uptime checks, and link validation.
          </p>
          <div className="rounded-lg bg-gray-900 p-4">
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
              <code>{`curl -X POST https://search.venym.io/api/v1/scrape \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "method": "HEAD"}'

# Response includes:
# {
#   "status_code": 200,
#   "status_text": "OK",
#   "headers": {...},
#   "response_time_ms": 142
# }`}</code>
            </pre>
          </div>
          <Link
            href="/docs/api/scrape"
            className="inline-flex items-center gap-1.5 text-sm text-[#efa72d] hover:text-[#d4911f] font-medium hover:underline"
          >
            View Scrape API Docs →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
