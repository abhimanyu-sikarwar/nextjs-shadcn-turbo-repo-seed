import { CharacterTraits } from "../types";

export class Prompts {

    buildAvatarPrompt(
        name: string,
        gender: string,
        age: string,
        characteristics?: CharacterTraits,
        customPrompt?: string
    ): string {

        const genderValue = gender;
        let pronoun = 'he';
        let genderForBackground = 'boys';
        if (genderValue.toLowerCase() === 'girl') {
            pronoun = 'she';
            genderForBackground = 'girls';
        }

        // Final prompt
        let prompt =
            `Full body of a Stylized new and unique 3D character design for an upcoming pixar movie. `;
        prompt += `${name}, a ${age}-old playful ${genderValue}, `;
            // `${name}, a ${age}-old playful ${genderValue} `;

        if (characteristics) {

            if (characteristics.hairstyle) {
                prompt += `with ${characteristics.hairstyle}. `
            }
            if (characteristics.hairColor) {
                prompt += `${characteristics.hairColor} hair `
            }
            if (characteristics.eyeColor) {
                prompt += `and ${characteristics.eyeColor} eyes. `
            }
            if (characteristics.skinTone) {
                prompt += `a cheerful expression, and a ${characteristics.skinTone} complexion, no freckles, `
            }
            if (characteristics.accessories) {
                prompt += `wearing ${characteristics.accessories}. `
            }

            if (characteristics.clothing) {
                prompt += `Dressed in an outfit featuring a ${characteristics.clothing} `
            }
            if (characteristics.clothingTopType) {
                prompt += `${characteristics.clothingTopType} of color ${characteristics.clothingTopColor} and ${characteristics.clothingBottomType} of color ${characteristics.clothingBottomColor}, `
            }
        }
        if (pronoun) {
            // prompt += `clear focus, color, white background. high fidelity, 4k, `
            // prompt += `${pronoun} stands on a white background, `
            // prompt += `${pronoun} stands with a smile on a whimsical background suitable for ${genderForBackground}, `
        }

        if (customPrompt) {
            prompt += `. ${customPrompt} `;
        }

        // Add quality modifiers
        prompt += 'clear focus, color, white background. high fidelity, 4k.';
        // prompt += 'In 3D Pixar Animation Style. Avoid crossed-eyes. Get the full view of the character with 10px padding on each side';
        // prompt += 'In 3D Pixar Animation Style. Avoid crossed-eyes. Generate the character from head to toe ';

        return prompt;
    }

}