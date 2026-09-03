# AYU-RAKSHA

## Protoype

```
                    USER
                     │
                     ▼
             POST /api/assess
                     │
                     ▼
          ┌─────────────────────┐
          │ Product Classifier  │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │  Rule / Risk Engine │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │    RAG Retriever    │
          │                     │
          │ Local official PDFs │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │       Groq LLM      │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Citation Validator  │
          └──────────┬──────────┘
                     │
                     ▼
              STRUCTURED JSON
                     │
                     ▼
                  FRONTEND
```
