export type CurrentSitin = {
    sitin_id: string
    idno: string
    firstname: string
    middlename: string
    lastname: string
    email: string
    username: string
    course: string
    yearlevel: string
    poke_icon: string
    sitin_purpose: string
    sitin_laboratory: string
    sitin_timein: string
}

export type Sitin = {
    sitin_id: string
    idno: string
    firstname: string
    middlename: string
    lastname: string
    course: string
    yearlevel: string
    sitin_purpose: string
    sitin_laboratory: string
    sitin_timein: string
    sitin_timeout: string
}