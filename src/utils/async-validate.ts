import { petNameIsExist } from "@/api/users"

export const validatePetNameExist = async (rule: any, value: string, callback: any) => {
    try {     
        let postData = { petName:value }
        const res = await petNameIsExist(postData)
        callback()
    } catch (error) {
        console.log(error,'error')
        callback(new Error(error))
    }
    
    // console.log(res,'9990000000')
    
};