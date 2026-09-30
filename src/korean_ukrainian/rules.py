FINAL_NEUTRALIZATION={"ㅅ":"ㄷ","ㅆ":"ㄷ","ㅈ":"ㄷ","ㅊ":"ㄷ","ㅌ":"ㄷ","ㄲ":"ㄱ","ㅋ":"ㄱ","ㅍ":"ㅂ"}
def apply_final_neutralization(coda): return FINAL_NEUTRALIZATION.get(coda,coda)