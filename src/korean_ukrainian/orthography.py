from __future__ import annotations

IPA_TO_UA={"i":"і","ɪ":"и","ɛ":"е","a":"а","ɔ":"о","u":"у","p":"п","b":"б","m":"м","f":"ф","ʋ":"в","t":"т","d":"д","n":"н","l":"л","r":"р","s":"с","z":"з","t͡s":"ц","d͡z":"дз","t͡ʃ":"ч","d͡ʒ":"дж","ʃ":"ш","ʒ":"ж","k":"к","ɡ":"ґ","x":"х","ɦ":"г","j":"й","tʲ":"ть","dʲ":"дь","nʲ":"нь","sʲ":"сь","zʲ":"зь","rʲ":"рь","lʲ":"ль","mʲ":"мь","pʲ":"пь","bʲ":"бь","ɾ":"р","ŋ":"нг","ɯ":"и","ʌ":"о","o":"о","e":"е","y":"ю","ø":"е","w":"в","ɰ":"и","tɕ":"ч","tɕ͈":"ч","tɕʰ":"ч","p͈":"п","t͈":"т","k͈":"к","pʰ":"п","tʰ":"т","kʰ":"к","s͈":"с","h":"г"}

def render_ipa_candidate(ipa:str)->str:
    return IPA_TO_UA.get(ipa,"�")

def render_sequence(segments:list[str])->str:
    rendered=[]
    for segment in segments:
        if segment=="":
            continue
        value=render_ipa_candidate(segment)
        if value=="�":
            raise ValueError(f"no Ukrainian graphemic realization registered for IPA segment {segment!r}")
        rendered.append(value)
    return "".join(rendered)
