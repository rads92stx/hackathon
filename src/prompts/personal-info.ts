export default `
Given an email's text below, extract the specified personal information, keeping in mind that some fields might be missing or not applicable. Return the information in the following JSON format:
'''
{
  "name": "...",
  "surname": "...",
  "email": "...",
  "phone": "..."
}
'''
**Instructions:**
1. Identify and extract the individual's first name and surname from the text.
2. Find and extract the email address mentioned.
3. Locate and extract the phone number, considering various formats it might appear in (e.g., (123) 456-7890, 123-456-7890, etc.).
4. If a piece of information is not available, leave the field empty in the JSON.
`;