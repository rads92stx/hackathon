export default function prompt() {
  return `
  Extract and explain questions and concerns from email content

<prompt_objective>
The exclusive purpose of this prompt is to meticulously analyze email content to identify and extract all questions and concerns, presenting them in a structured JSON response. Each question should maintain the context to ensure clarity and accuracy.
</prompt_objective>

<prompt_rules>
- Analyze the text to accurately identify any sentences that constitute a question, including indirect or implied questions, ensuring context is preserved.
- List all extracted questions under the "questions" array in the JSON output, with contextual clarity.
- Provide an explanation of the extraction logic and context understanding process in the "_thinking" field within the JSON.
- ABSOLUTELY FORBIDDEN to add or make up information not present in the email text.
- Use only the provided text as the basis for analysis, ensuring precision and maintaining email-related context.
- Handle empty or ambiguous inputs by clearly indicating no questions were identified or stating the ambiguity.
- UNDER NO CIRCUMSTANCES should additional information beyond the email content be inferred or assumed.
</prompt_rules>

<prompt_examples>

<example>
    <user>"I received an email about our meeting. Can you attend? Also, what time works for you?"</user>
    <ai>
        {
          "_thinking": "Extracted 'Can you attend?' and 'What time works for you?' within the context of arranging a meeting.",
          "questions": ["Can you attend?", "What time works for you?"]
        }
    </ai>
</example>

<example>
    <user>"Dziękuję za propozycję zatrudnienia. Czy istnieje możliwość elastycznych godzin pracy?"</user>
    <ai>
        {
          "_thinking": "Identified 'Czy istnieje możliwość elastycznych godzin pracy?' as a direct question related to working conditions in the context of a job offer.",
          "questions": ["Czy istnieje możliwość elastycznych godzin pracy?"]
        }
    </ai>
</example>

<example>
    <user>
       "Szanowni Państwo, Chciałbym zapytać o szczegółowy plan mojego wdrożenia. Kiedy mogę spodziewać się pierwszego dnia pracy? Czy przewidziane jest spotkanie z moim bezpośrednim przełożonym przed rozpoczęciem pracy? Jak będzie wyglądał proces zapoznania mnie z obowiązkami i narzędziami pracy?"
    </user>
    <ai>
        {
          "_thinking": "Mail ten obejmuje pytania dotyczące szczegółów i przebiegu procesu wdrożenia nowego pracownika, with context related to onboarding procedures.",
          "questions": [
            "Kiedy mogę spodziewać się pierwszego dnia pracy?",
            "Czy przewidziane jest spotkanie z moim bezpośrednim przełożonym przed rozpoczęciem pracy?",
            "Jak będzie wyglądał proces zapoznania mnie z obowiązkami i narzędziami pracy?"
          ]
        }
    </ai>
</example>

<example>
    <user>
        "Szanowni Państwo, W związku z przyjęciem przeze mnie oferty pracy, chciałbym zapytać o wyposażenie stanowiska pracy. Czy firma zapewnia laptop, telefon służbowy oraz wszelkie niezbędne oprogramowanie? Jeśli tak, to kiedy mogę spodziewać się ich otrzymania?"
    </user>
    <ai>
        {
          "_thinking": "Mail contains questions about equipment provisioning as part of new employment package.",
          "questions": [
            "Czy firma zapewnia laptop, telefon służbowy oraz wszelkie niezbędne oprogramowanie?",
            "Jeśli tak, to kiedy mogę spodziewać się ich otrzymania?"
          ]
        }
    </ai>
</example>

<example>
    <user>
        "Szanowni Państwo, Cieszę się, że zostanę częścią Waszego zespołu. Chciałbym dowiedzieć się więcej o kulturze organizacyjnej firmy. Jakie są wartości, którymi kierują się pracownicy? Jakie są zwyczaje i tradycje w firmie?"
    </user>
    <ai>
        {
          "_thinking": "Mail seeks an explanation of company values and traditions within the framework of organizational culture.",
          "questions": [
            "Jakie są wartości, którymi kierują się pracownicy?",
            "Jakie są zwyczaje i tradycje w firmie?"
          ]
        }
    </ai>
</example>

<example>
    <user>
        "Szanowni Państwo, W związku z otrzymaną ofertą pracy, chciałbym zapytać o dodatkowe benefity, które przysługują pracownikom firmy. Czy firma oferuje np. prywatną opiekę medyczną, kartę sportową, czy dofinansowanie do szkoleń?"
    </user>
    <ai>
        {
          "_thinking": "Mail pertains to questions about employee benefits specifically provided by the company.",
          "questions": [
            "Czy firma oferuje np. prywatną opiekę medyczną, kartę sportową, czy dofinansowanie do szkoleń?"
          ]
        }
    </ai>
</example>

<example>
    <user>
        "Szanowni Państwo, Chciałbym zapytać o możliwość pracy zdalnej lub elastyczne godziny pracy. Czy istnieje taka możliwość na moim stanowisku? Jeśli tak, to jakie są warunki?"
    </user>
    <ai>
        {
          "_thinking": "Mail inquiries about remote work and flexible hours pertinent to the specific job role.",
          "questions": [
            "Czy istnieje taka możliwość na moim stanowisku?",
            "Jeśli tak, to jakie są warunki?"
          ]
        }
    </ai>
</example>

<example>
    <user>
        "Temat: Informacja o urlopie - pytania

        Cześć,

        Mam kilka pytań związanych z planowanym urlopem:

        Czy istnieje możliwość przesunięcia terminu urlopu?
        Jakie są zasady dotyczące zgłaszania urlopu warunkowego?
        Czy mogę kontaktować się z HR w przypadku dodatkowych pytań?

        Dzięki za odpowiedź.

        Pozdrawiam,
        [Twoje imię]
        [Twój numer telefonu]
        [Twój adres e-mail]"
    </user>
    <ai>
       {
         "_thinking": "Mail ten przedstawia pytania dotyczące zasad i możliwości planowania urlopu, istotne dla zarządzania czasem wolnym pracowników.",
         "questions": [
           "Czy istnieje możliwość przesunięcia terminu urlopu?",
           "Jakie są zasady dotyczące zgłaszania urlopu warunkowego?",
           "Czy mogę kontaktować się z HR w przypadku dodatkowych pytań?"
         ]
       }
    </ai>
</example>

<example>
    <user>
        "Temat: Senior JS dev - zapytanie o widełki wynagrodzeń 
    
        Szanowni Państwo,
    
        piszę w sprawie oferty pracy, którą otrzymałem/am. Jestem bardzo zainteresowany/a tą pozycją i chciałbym/abym dowiedzieć się więcej na temat widełek wynagrodzeń przewidzianych dla tego stanowiska.
    
        Z góry dziękuję za odpowiedź.
    
        Z poważaniem, 
        [Twoje imię] 
        [Twój numer telefonu] 
        [Twój adres e-mail]"
    </user>
    <ai>
    {
      "_thinking": "This email is about an inquiry into salary brackets for a Senior JS developer position, framed within the context of a job offer.",
      "questions": [
        "Jakie są widełki wynagrodzeń dla senior JS developera?"
      ]
    }
    </ai>
</example>

</prompt_examples>
`;
}
