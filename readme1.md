RAG = Retrieval Augmented Generation

Instead of training an AI on your data, you retrieve relevant data and give it to the LLM before it answers.

Problem without RAG
LLMs:
don’t know your private data
may hallucinate
may be outdated

for Example:
User: Explain my company policy
LLM: Doesn't know

RAG solution:

User Question
↓
Retrieve relevant documents
↓
Send docs + question to LLM
↓
Generate answer

important thing is that RAG does NOT train the model.

3. What is LangChain?

LangChain is: A framework for building LLM applications.

It provides reusable building blocks:

* models
* retrievers
* chains
* memory
* agents

Without LangChain
You manually manage:

* prompt creation
* model calls
* retrieval logic
* tool execution

With LangChain
You connect components easily.

RAG Architecture (MOST IMPORTANT!!!)

Documents
↓
Text Splitting (Chunks)
↓
Embeddings
↓
Vector Database
↓
Retriever
↓
LLM
↓
Answer

Nowe we will break each part and study it in depth

1. Documents

Your data source:

* PDFs
* notes
* docs
* markdown files
* websites

For examples:

* DSA notes
* Project docs
* Tutorials

2. Chunks (Text Splitting)

Large documents are split into smaller pieces.

Why?

* easier retrieval
* better context matching

for example:

(we feeded the documentation of DSA) so the chunk process will do the following

Chunk 1 → Binary Search
Chunk 2 → Trees
Chunk 3 → Graphs

Inorder to split the data or divide the data into the chunks we have a common splitter called:

* RecursiveCharacterTextSplitter

3. Embeddings (Most Important Concept)

Embedding = text converted into numbers.

for exmaple:

* "binary search"  -> text
  → \[0.12, 0.91, 0.44 ...] into numbers

purpose:

* semantic understanding

so Instead of exact words, the system understands meaning.

4. Vector Databases

Stores embeddings.

In normal db:

* we search by text but..

Vector DB:
search by meaning (semantic meaning)

Common vector dbs
Examples:
Pinecone
Chroma
MongoDB Atlas Vector Search

5. Retriever

The main task of the retriever is to do the following:

1. Converts user question into embedding

2. Finds similar chunks

3. Sends them to LLM

4. LLM (Generation Step)

LLM receives:
Question + Retrieved Context

At last it gives the Final answer

Now lastly

* Where LangChain fits

LangChain helps connect everything:

* Loader
* Splitter
* Embeddings
* VectorStore
* Retriever
* Chain

Now, once we have understood this, we'll go through an example and understand all the architecture of RAG, basicallt:-

Suppose i wanna make:
"Java Notes Assistant"

I have one document:
java\_notes.txt

Inside it:

Binary Search:
Binary search works on sorted arrays...

Linked List:
A linked list is a linear data structure...

HashMap:
HashMap stores key-value pairs...

Goal:
User asks: "Explain Binary Search"

Now According to the RAG architecture, which includes the following:

1. Documents

2. Text Splitting (Chunks)

3. Embeddings

4. Vector Database

5. Retriever

6. LLM

Lastly Answer:-

1. STEP 1 — Document Loading

Your system reads files from disk.

Conceptually:
File → Text in memory

Internally:

PDF/text is converted into plain text
LangChain wraps it into a Document object

That is:

Raw file → structured document

Why needed?
Because LLMs work with text, not files.

2. STEP 2 — Chunking (Text Splitting)

Problem is that:

* LLMs cannot efficiently handle very large documents.

so we Split:

Large document
↓
Small chunks

Exmaple result:

Chunk 1:
Binary search works on sorted arrays...

Chunk 2:
Linked list is a linear data structure...

Chunk 3:
HashMap stores key-value pairs...

* Why chunking matters??

If you don’t chunk:

* LLM gets too much irrelevant text

Chunking allows:

* faster search
* precise retrieval
* lower cost

3. STEP 3 — Embeddings

What happens?

* Each chunk is converted into numbers.

For example:
"Binary search works on sorted arrays"
→ \[0.21, 0.88, 0.43, ...]

This is only called as embeddings.

The question is why do we do this?

* We basically do this because computers compare numbers better than text.

"binary search"
≈
"search in sorted array"

4. STEP 4 — Store in Vector Database

Now, basically, the embeddings that we created will store them in the vector databases.

For example:
Vector DB:
\[
{chunk: Binary Search..., vector: \[...]},
{chunk: Linked List..., vector: \[...]},
{chunk: HashMap..., vector: \[...]}
]

5. STEP 5 — User Asks Question

user:
"Explain Binary Search"

What happens internally is that the questions the user asked will also be converted into embeddings.

just like this :
Question → \[0.22, 0.86, 0.41 ...]

6. STEP 6 — Retrieval (Core of RAG)

Now system compares vectors.

It basically asks:

* Which stored chunks are most similar?

result would be:

Top match → Binary Search chunk

7. STEP 7 — Send Context to LLM

Now LLM receives:

Question:
Explain Binary Search

Context:
Binary search works on sorted arrays...

8. Final Answer

Binary Search is an algorithm used on sorted arrays...

RAG has basically two phases:-

1. Ingestion phase (Load → Chunk → Embed → Store)
2. queury phase (Question → Retrieve → Generate)

## Now, how do real engineers actually split the code?

Two Pipelines

1. Ingestion Pipeline (runs once)
2. Query Pipeline (runs per questions)

Why do we split??

because:
Embedding documents is expensive.
You DO NOT want to reprocess documents every time a user asks something.

## What Runs ONCE (Ingestion Pipeline)

This happens when:
you add new documents
update knowledge base
upload files

Flow is:
Load documents
↓
Split into chunks
↓
Create embeddings
↓
Store in vector DB

After This step:

Vector DB is ready.
No need to repeat this task again

## What Runs PER QUESTION (Query Pipeline)

This runs everytime user ask something

Flow is:
User question
↓
Question embedding
↓
Vector DB retrieval
↓
Send context to LLM
↓
Generate answer

Hence, the folder structure somewhat looks like this:

rag-langchain/
│
├── src/
│   ├── ingest.ts        ← runs once
│   ├── query.ts         ← runs per question
│   ├── vectorStore.ts   ← shared DB setup
│   ├── config.ts
│
├── LangChain.ts
├── README.md

## what each files does??

* Ingest.ts (ONE TIME) ingestion pipeline task

Responsibilities:
load documents
split text
create embeddings
store vectors

flow is : documents → chunks → embeddings → vector DB

* Query.ts (Every Question)

Responsibilities:
receive question
retrieve relevant chunks
call LLM
return answer

The flow is : question → retriever → LLM → answer

* vectorStore.ts (Shared Setup)

The purpose is Single place to connect vector DB.

virtual Architecture

```
            ┌──────────────┐
            │ Documents     │
            └──────┬───────┘
                   │
             (ingest.ts)
                   │
            ┌──────▼───────┐
            │ Vector DB     │
            └──────┬───────┘
                   │
             (query.ts)
                   │
            ┌──────▼───────┐
            │ LLM           │
            └──────┬───────┘
                   │
                Answer
```

Last few topics left:-

1. Prompt design with context

2. Retrieval tuning (top\_k etc.)

3. Metadata filtering

Many poeple think that:

* Retriever → LLM magically knows what to do
* but this is wrong

what actually happens is:

* The LLM only sees text.

so basically:
we build a prompt
\+
You inject retrieved context inside it

Example (Bad Prompt)

Question: Explain Binary Search
Context: \[retrieved chunk]

Problem:

* unclear instructions
* inconsistent answers

Exmaple (Good Prompt)

\`You are a Java DSA tutor.

Use ONLY the provided context to answer.

If the answer is not in the context, say:
"I don't know based on the provided documents."

Context:
{retrieved\_chunks}

Question:
{user\_question}\`

### Why this matters

Prompt controls:-

* hallucination level
* response style
* accuracy
* tone

### so the real formula is = Good Retrieval + Good Prompt = Good Answer

2. Retrieval Tuning (top\_k etc.) (very interesting)

Retriever does NOT return everything.
It returns:
Top K most relevant chunks

## What is top\_k?

Example:
top\_k = 3

Means:
return 3 most similar chunks.

Visual Example
Vector DB results:

1. Binary Search chunk (95%)
2. Searching Algorithms chunk (90%)
3. Arrays chunk (88%)
4. Linked List chunk (40%)
   If:
   top\_k = 3
   Only first 3 are sent.

practical rule is:

top\_k = 3 or 4 not 10 not 1

3. Metadata Filtering

### What is metadata?

* Extra information stored with each chunk.
* for exmaple:

{
text: "Binary Search works on sorted arrays",
topic: "Searching",
difficulty: "Easy",
source: "java\_notes.pdf"
}

* result becomes much more acurate with meta data

- so Search relevant category only

This improves:

* speed

* accuracy

* cost

* so the final flow is this

User Question
↓
Metadata Filter
↓
Retriever (top\_k)
↓
Context
↓
Prompt Template
↓
LLM
↓
Answer


<!-- done -->

