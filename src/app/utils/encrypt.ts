import crypto from "crypto"

const encryption_key = process.env.ENCRYPTION_KEY as string; // Must be 32 characters
const initialization_vector = process.env.INITIALIZATION_VECTOR as string; // Must be 16 characters

export function encrypt(text: string){
  const cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from(encryption_key), Buffer.from(initialization_vector))
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export function decrypt(text: string){
  const decipher = crypto.createDecipheriv('aes-256-cbc',Buffer.from(encryption_key), Buffer.from(initialization_vector))
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
