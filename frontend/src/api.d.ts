declare const api: any;
export declare function login(email: string, password: string): Promise<any>;
export declare const refresh: () => any;
export declare const register: (payload: {
    username: string;
    email: string;
    password: string;
    role: "user" | "admin";
}) => any;
export declare const me: () => any;
export declare const getSkills: () => any;
export declare const createSkill: (payload: {
    name: string;
}) => any;
export declare const listUserSkills: () => any;
export declare const addUserSkill: (payload: any) => any;
export declare const deleteUserSkill: (id: string) => any;
export declare const suggestions: () => any;
export declare const createSwipe: (body: any) => any;
export declare const listMatches: () => any;
export declare const listCreditTxns: () => any;
export default api;
//# sourceMappingURL=api.d.ts.map