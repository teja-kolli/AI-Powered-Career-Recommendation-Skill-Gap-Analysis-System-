from django.conf import settings
from supabase import create_client

from .embeddings import create_embedding


# =========================================================
# SUPABASE CLIENT
# =========================================================

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY
)


# =========================================================
# RETRIEVE DOCUMENTS
# =========================================================

def retrieve_documents(
    query,
    limit=5,
    category=None,
    domain=None
):

    # -----------------------------------------------------
    # Create Query Embedding
    # -----------------------------------------------------

    query_embedding = create_embedding(
        query
    )


    # -----------------------------------------------------
    # Supabase Vector Search
    # -----------------------------------------------------

    response = supabase.rpc(
        "match_rag_documents",
        {
            "query_embedding": query_embedding,
            "match_count": limit,
            "filter_category": category,
            "filter_domain": domain,
        }
    ).execute()


    # -----------------------------------------------------
    # Return Documents
    # -----------------------------------------------------

    return response.data or []