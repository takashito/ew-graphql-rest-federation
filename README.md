# ew-graphql-rest-federation
REST API federation by Akamai EdgeWoker Graphql Service


### REST API
3 REST API to federate and turn into Graphql Service <br>

Books : https://ewdemo.test.edgekey.net/mockapi/books <br>
Authors : https://ewdemo.test.edgekey.net/mockapi/authors <br>
Publishers : https://ewdemo.test.edgekey.net/mockapi/publishers <br>

Database : https://ewdemo.test.edgekey.net/mockapi/db
Sorce Code : https://github.com/takashito/mockapi


## Schema
```
  type Author {
    id: ID!
    name: String!
    books: [Book!]!
    debug: Debug
  }
  
  type Book {
    id: ID!
    name: String!
    publisher: Publisher!
    authors: [Author!]!
    debug: Debug
  }
  
  type Publisher {
    id: ID!
    name: String!
    books: [Book!]!
    debug: Debug
  }

  type Debug {
    url: ID!
    status: String!
    latency: String
    cacheable: String
    cacheKey: String
    cacheHit: String
  }

  type Query {
    authors: [Author!]!
    author(id: ID!): Author!
    books: [Book!]!
    book(id: ID!): Book!
    publishers: [Publisher!]!
    publisher(id: ID!): Publisher!
  }
```

## Example URLs without Debug info
https://ewdemo.test.edgekey.net/federation/graphql?query={publishers{name,books{name}}}<br>
https://ewdemo.test.edgekey.net/federation/graphql?query={authors{name,books{name}}}<br>
https://ewdemo.test.edgekey.net/federation/graphql?query={books{name,authors{name},publisher{name}}}
<br>


## Example URLs with Debug info
https://ewdemo.test.edgekey.net/federation/graphql?query={publishers{name,books{name},debug{url,cacheKey,cacheHit}}}<br>
https://ewdemo.test.edgekey.net/federation/graphql?query={authors{name,books{name,debug{url,cacheKey,cacheHit}}}}<br>
https://ewdemo.test.edgekey.net/federation/graphql?query={books{name,debug{url,cacheHit},authors{name,debug{url,cacheHit,cacheKey}},publisher{name,debug{url,cacheHit}}}}
<br>

url: REST API call to fetch information
cacheable: REST API is cacheable or not
cacheKey: Akamai CacheKey
cacheHit: 
  - EDGE-HIT : REST API was responded from Edge cache
  - REMOTE-HIT : REST API was responded from parent cache
  - CACHE-MISS : REST API was responded from mock api server (origin)

## Known EW Issue

- sending query via POST will not work due to [EdgeWorker limitation](https://learn.akamai.com/en-us/webhelp/edgeworkers/edgeworkers-user-guide/GUID-F709406E-2D67-4996-B619-91E90F04EDF2.html)

- when upload bundle file to sandbox or staging, you will see error 
```
ERROR: got unexpected response from API:
{
  "type": "/sandbox-api/error-types/bad-request",
  "title": "Bad Request.",
  "detail": "Error in tarball file : [Error[message=uncompressed size exceeds the limit of 1 MB, type=MAX_UNCOMPRESSED_SIZE_EXCEEDED]]",
  "instance": "/sandbox-api/error-instances/f4a1637a-c44f-43ec-b02a-f3e60c9ba3c3",
  "status": 400,
  "path": "/sandbox-api/v1/sandboxes/d125b951-d59e-46cf-96b5-f545449d7a1a/edgeworkers/5939",
  "method": "PUT"
}
```
This is due to the EW limitation that bundled code size need to be < 1MB.
to avoid this error, you need to edit follwoing file

```
./node_modules/graphql-helix/dist/render-graphiql.js
