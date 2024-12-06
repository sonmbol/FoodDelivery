
import { getContextValue } from "./context";

class Language {
    static isArabic(): boolean {
        const language = getContextValue<string>('language');
        return language === 'ar';
    }
}
export default Language