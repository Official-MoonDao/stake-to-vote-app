import { getAccessToken } from "@privy-io/react-auth";
import { pinImageToIPFS } from "../ipfs/pin";
import toast from "react-hot-toast";

export async function pinBlobOrFile (blob: Blob | File): Promise<string> {
  try {
    const imageFormData = new FormData()
    imageFormData.append('file', blob)

    const accessToken = await getAccessToken()
    const pin = await fetch('/api/ipfs/pin', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: imageFormData
    })
    const { cid } = await pin.json();
    const url = `https://tan-collective-smelt-690.mypinata.cloud/ipfs/${cid}`
    return url
  } catch (e) {
    toast.error(`Error pinning file to IPFS`)
    return Promise.reject(e)
  }
}
