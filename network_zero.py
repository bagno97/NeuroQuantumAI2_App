def process_input_zero(text):
    return {'length': len(text), 'is_question': text.strip().endswith('?')}
