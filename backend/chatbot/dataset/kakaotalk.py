import re
from chatbot.dataset.base import ChatDatasetBase
from db.crypt import crypt


# extract logics for kakaotalk mobile
def is_chat(line, data_type):
    if data_type == "kakaotalk_mobile":
        pattern = r"^\d{4}년 \d{1,2}월 \d{1,2}일 (?:오전|오후) \d{1,2}:\d{2},"
        return bool(re.search(pattern, line))
    else:
        pattern = r"^\[(.*?)\].*?\[(.*?)\]"
        return bool(re.findall(pattern, line))


def extract_chat(line, data_type):
    if data_type == "kakaotalk_mobile":
        # extract date
        pattern = r"^\d{4}년 \d{1,2}월 \d{1,2}일 (?:오전|오후) \d{1,2}:\d{2},"
        date = re.findall(pattern, line)[0][:-1]
        line = re.sub(pattern, '', line)[1:-1]

        # extract speaker and text
        pattern = r".+ : "
        speaker = re.findall(pattern, line)[0][:-3]
        text = re.sub(pattern, '', line)
    else:
        pattern = r"^\[(.*?)\].*?\[(.*?)\]"
        speaker, t = re.findall(pattern, line)[0]
        text = re.sub(pattern, '', line)[1:-1]

    return speaker, text


# general filtering logics
def is_emoticon(text):
    return text == '이모티콘'


def is_picture(text):
    return text == '사진'


class KakaotalkDataset(ChatDatasetBase):
    def __init__(self, data_type, n_vocab, path_data, path_vocab, speaker=None):
        # data_type
        self.data_type = data_type
        
        if self.data_type not in ['kakaotalk_mobile', 'kakaotalk_pc']:
            raise KeyError(f"Invalid data_type: {data_type}")

        # base initialization
        super().__init__(n_vocab, path_data, path_vocab)
        
        # speaker filtering
        if speaker is not None:
            self.ids = [i for i in self.ids if self.data[i]['speaker_name'] == speaker]
            self.len = len(self.ids)


    def load_data(self, path_data):
        with open(path_data, 'r', encoding="utf8") as f:
            # decrypt data
            data = crypt.decrypt(f.read()).split('\n')

            i_prev = None
            speaker_prev = None

            for i, line in enumerate(data):
                if not is_chat(line, self.data_type):
                    continue

                # extract chat
                try:
                    speaker, text = extract_chat(line, self.data_type)
                except IndexError:
                    # TMP exception for passing '\n' in lines
                    continue

                if is_emoticon(text):
                    continue
                if is_picture(text):
                    continue

                # add chat into data
                if (i_prev is None) or (speaker_prev != speaker):
                    self.data[i] = {
                        'id': i,
                        'speaker_name': speaker,
                        'text': [text],
                        'question_id': i_prev,
                        'question_speaker_name': speaker_prev,
                    }
                    i_prev = i
                else:
                    self.data[i_prev]['text'].append(text)

                speaker_prev = speaker