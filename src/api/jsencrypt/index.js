import { JSEncrypt } from 'jsencrypt' //加密

// 用户公钥
const userPublicKey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCylSU2oO8hRki+hfBXt/Tj4pcL0NxJPzvFOBeIYFx+b7TuraSn1UPuvEUZf4u8hApy/S9KJLQ/LsaiBc3GcTfsGpUnwFQ8mNsD59/HFn9GWCd5+pcnJ03BpcT0SXVj42qZ5r229ZZhOiLmaMl0mmIjbobN3G2WbgJZq1F1ep7c0wIDAQAB-----END PUBLIC KEY-----"
export async function encrypt(str) {
	return new Promise((resolve, reject) => {
		let encryptor = new JSEncrypt()
		let key = userPublicKey;
		encryptor.setPublicKey(key)
		let rsaPassWord = encryptor.encrypt(str)
		if (rsaPassWord) {
			return resolve(rsaPassWord)
		} else {
			reject({ 'err': "" })
		}
	})
}
