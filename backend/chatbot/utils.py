import numpy as np
from collections import Counter
from .constants.custom_tokens import *


def get_bleu(reference, candidate, N=4):
    mask = ~reference.eq(PAD)
    reference = reference[mask].tolist()
    candidate = candidate[mask].tolist()

    ps = []

    for n in range(1, min(N+1, len(candidate) + 1)):
        ngram_r = Counter([tuple(reference[i:i+n]) for i in range(len(reference)-n+1)])
        ngram_c = Counter([tuple(candidate[i:i+n]) for i in range(len(candidate)-n+1)])

        # modified precision
        p = sum((ngram_r & ngram_c).values()) / sum(ngram_c.values())

        # weight
        w = 1 / N

        ps.append(p ** w)
    
    # brevity penalty
    bp = min(1, np.exp(1- len(reference) / (len(candidate) + 1e-10)))

    bleu = bp * np.prod(ps)
    bleu *= 100

    return bleu