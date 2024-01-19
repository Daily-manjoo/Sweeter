import { languageState } from "atom";
import { useRecoilValue } from "recoil";
import TRANSLATIONS from "constants/languags";

export default function useTranslation(){
    const lang = useRecoilValue(languageState);

    return(key: keyof typeof TRANSLATIONS) => {
        return TRANSLATIONS[key][lang];
    }
}