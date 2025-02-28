export const toBase64 = (string : string) =>{
    return `url('data:image/svg+xml;base64,${string.replace(/[\n\r\t]/gm, "")}')`
};