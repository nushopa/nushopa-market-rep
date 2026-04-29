import type { SelectOption } from '../../component/customeComp/SelectInput';
import SelectInput from '../../component/customeComp/SelectInput';

const Language = () => {
  const languageOptions: SelectOption[] = [
    {
      value: 'en',
      label: '🇺🇸 English (US)',
      name: 'language'
    },
    {
      value: 'en-GB',
      label: '🇬🇧 English (UK)',
      name: 'language'
    },
    {
      value: 'fr',
      label: '🇫🇷 Français',
      name: 'language'
    }
  ];

  const handleLanguageChange = (value: string | number) => {
    console.log('Selected language:', value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-4 px-4">
      <div className="flex items-center mb-4">
       <p className="text-lg font-semibold text-gray-900">
          Language
        </p>
      </div>
      
      <SelectInput
        name="language"
        label=""
        options={languageOptions}
        value="en"
        onChange={handleLanguageChange}
        placeholder="Choose a language..."
        className="max-w-md"
        required
      />
    </div>
  );
};

export default Language;