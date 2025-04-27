
export function formatNotesAndTerms(content: string) {
  return content.replace(
    /((?:^|\n)(?:#{1,3}\s+)?(?:9\.\s+)?(?:Notes & Terms|NOTES & TERMS|Notes and Terms|NOTES AND TERMS)[^\n]*\n)((?:.|\n)*?)(?=\n#{1,3}\s|\n*$)/g,
    () => `
# SECTION 9: NOTES AND TERMS

**Payment Terms:**
- A 40 % deposit is required before work commences
- 40 % progress payment upon completion of framework and decking
- 20 % final payment upon project completion and client satisfaction

**General Terms:**
- This quote is valid for 30 days from the date of issue
- All work will be carried out in accordance with the New Zealand Building Code
- Building consent may be required and is the responsibility of the client unless otherwise specified
- Any variations to the scope of work will require a written agreement and may affect the final cost
- Weather conditions may affect the project timeline
- Brenton Building provides a 5-year workmanship warranty on all completed work
- Material warranties are as per manufacturer specifications
- Site access must be provided during working hours (7 : 30 AM – 5 : 00 PM, Monday–Friday)

`
  );
}
