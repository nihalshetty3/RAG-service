from app.db.chunks import search_similar_chunks
from app.services.embedding_service import generate_embedding

def retrieve_chunks(
    query: str,
    limit: int=10,
):
    
    embedding = generate_embedding(query)
    
    return search_similar_chunks(
        embedding=embedding,
        limit=limit
    )