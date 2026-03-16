"""
SM-2 Spaced Repetition Algorithm implementation.

Reference: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
"""


def calculate_srs(
    ease_factor: float, interval: int, repetitions: int, score: int
) -> tuple[float, int, int]:
    """
    SM-2 algorithm for spaced repetition scheduling.

    Args:
        ease_factor: Current ease factor (minimum 1.3)
        interval: Current interval in days
        repetitions: Number of consecutive correct repetitions
        score: User's self-assessed score (0-5)
            0 - Complete blackout
            1 - Incorrect, but remembered upon seeing the answer
            2 - Incorrect, but the answer seemed easy to recall
            3 - Correct with serious difficulty
            4 - Correct with some hesitation
            5 - Perfect response

    Returns:
        Tuple of (new_ease_factor, new_interval, new_repetitions)
    """
    # Clamp score to valid range
    score = max(0, min(5, score))

    if score < 3:
        # Failed: reset repetitions and interval
        new_repetitions = 0
        new_interval = 1
        new_ease_factor = ease_factor
    else:
        # Success: update ease factor and increase interval
        new_ease_factor = ease_factor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02))
        new_repetitions = repetitions + 1

        if new_repetitions == 1:
            new_interval = 1
        elif new_repetitions == 2:
            new_interval = 6
        else:
            new_interval = round(interval * ease_factor)

    # Ease factor must not go below 1.3
    new_ease_factor = max(1.3, new_ease_factor)

    return new_ease_factor, new_interval, new_repetitions
