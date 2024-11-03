
export const randomPassword = (length:number):string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%&*-_?';

    const passwordArray = [
        uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
    ];
    
    for (let i = 1; i < length-2; i++) {
        passwordArray.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)))
    }
    passwordArray.push(
        specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length)), // 1 special char
        numbers.charAt(Math.floor(Math.random() * numbers.length)), 
    )
    
    return passwordArray.join('');
}