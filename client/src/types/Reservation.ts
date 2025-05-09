export type Reservation = {
    id: string;
    idno: string;
    labno: string;
    pcno: string;
    purpose: string;
    timein: string;
    status: string;
}

export type StudentReservation = {
    id: string;
    idno: string
    firstname: string
    middlename?: string
    lastname: string
    course: string
    yearlevel: string
    email: string
    username: string
    password: string
    sessions: string
    poke_icon: string
    labno: string;
    pcno: string;
    purpose: string;
    timein: string;
    status: string;
}