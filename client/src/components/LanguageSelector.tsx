import { LANGUAGE_VERSIONS } from "../constants/Action";

interface Props {
  language: string;
  onSelect: (lang: string) => void;
}

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect }: Props) => {
  typeof language;
  typeof onSelect;

  return (
    <div>
      <div>Language:</div>
      <div>Button</div>
    </div>
  );
};
export default LanguageSelector;
