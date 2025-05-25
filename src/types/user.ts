export enum EGender {
    Male = 1,
    Female = 2
}

export enum EStatus {
    Active = 1,
    Deactive = 2
}

export enum EOccupation {
    Student = 1,
    Employee = 2
}

export enum EState {
    Johor = 1,
    Kedah = 2,
    Kelantan = 3,
    Melaka = 4,
    NegeriSembilan = 5,
    Pahang = 6,
    PulauPinang = 7,
    Perak = 8,
    Perlis = 9,
    Selangor = 10,
    Terengganu = 11,
    Sabah = 12,
    Sarawak = 13,
    WilayahPersekutuanKualaLumpur = 14,
    WilayahPersekutuanLabuan = 15,
    WilayahPersekutuanPutrajaya = 16
}

export interface IUser extends Document {
    u_email: string;
    u_password: string;
    u_name: string;
    u_gender: EGender;
    u_state: EState;
    u_occupation: EOccupation;
    u_status: EStatus;
    createdAt: Date;
    updatedAt: Date;
}
