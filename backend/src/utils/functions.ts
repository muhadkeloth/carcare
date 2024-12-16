
export const randomPassword = (length:number):string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%&*|<>?';

    const passwordArray = [
        uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
    ];
    
    for (let i = 1; i < length-2; i++) {
        passwordArray.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)))
    }
    passwordArray.push(
        specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length)),
        numbers.charAt(Math.floor(Math.random() * numbers.length)), 
    )
    
    return passwordArray.join('');
}

export const formatDate = (isoDate: Date | undefined | string) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  export const dateFilterforChart = (period:'monthly'|'yearly'|'weekly') => {
    const now = new Date();
    const dateFilter = {
        'monthly': { 
            $gte: new Date(now.setMonth(now.getMonth() - 1))
         },
        'yearly': { 
            $gte: new Date(now.setFullYear(now.getFullYear() - 1))
         },
        'weekly': {
            $gte: new Date(now.setDate(now.getDate() - 7))
         },
      }
      return dateFilter[period];
  }



//   export const getMissingPeriods = (data:any[],startDate:Date,endDate:Date,period:string) => {
//     const result = [];
//     const date = new Date(startDate);
//     while(date <= endDate){
//         const formattedDate = period === 'monthly' 
//             ? format(date, 'yyyy-MM')
//             : period === 'yearly'
//             ? format(date, 'yyyy')
//             : format(date, 'yyyy-ww');
//         const item = data.find((d) => d._id === formattedDate);
//         result.push({_id: formatDate, count: item ? item.count : 0});
//         if(period === 'monthly'){
//             date.setMonth(date.getMonth()+1);
//         }else if(period === 'yearly'){
//             date.setFullYear(date.getFullYear()+1);
//         }else{
//             date.setDate(date.getDate()+7);
//         }
//     }
//     return result
//   }

//   export const formatMonthlyNames = (data:any[]) => {
//     return data.map((item) => {
//         const [year, month] = item._id.split('-');
//         const date = new Date(+year, +month -1);
//         const monthName = format(date, 'MMM yyyy');
//         return {...item, _id:monthName}
//     })
//   }