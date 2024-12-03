export default function prompt() {
  return `
      Given an email's text below, extract the specified personal information of the **sender** of the email, keeping in mind that some fields might be missing or not applicable.  Do **not** extract phone numbers or other contact information that the sender is *asking about*, only information that belongs to the sender themselves. Return the information in the following JSON format:
      '''
      {
        "name": "...",
        "surname": "...",
        "email": "...",
        "phone": "...",
        "appliedPosition": "..."
      }
      '''
      **Instructions:**
      1. Identify and extract the sender's first name and surname from the text.
      2. Find and extract the sender's email address.
      3. Locate and extract the sender's phone number, considering various formats.
      4. If a piece of information is not available, leave the field empty in the JSON.  Specifically, if the sender is *asking* about a phone number and not *providing* their own, leave the "phone" field empty.

      <example>
        User: Subject: Senior JS dev - salary and benefits enquiry Dear Sirs, Thank you for the opportunity to apply for the position of Senior JS Developer. I am very interested in this offer. In addition to the information about the salary range, I would like to inquire about the additional benefits you offer your employees. Yours sincerely, Dupa1234 TheDog 500123456
        Assistant: { "name": "Kuba", "surname": "TheDog", "phone": "500123456", "email": "", "appliedPosition": "Senior JS Developer" }

        User: Subject: Application for Frontend Developer Position - Salary and Benefits Inquiry, Dear Sirs, Thank you for the opportunity to apply for the position of Frontend Developer. I am highly interested in this role and would like to inquire about the salary range as well as the additional benefits your company offers to employees. Looking forward to your response. Best regards, Michael Smith Tel: +44 772345678 Email: michael.smith@example.com
        Assistant: { "name": "Michael", "surname": "Smith", "phone": "+44 772345678", "email": "michael.smith@example.com", "appliedPosition": "Frontend Developer" }
      </example>
    `
  ;
}
