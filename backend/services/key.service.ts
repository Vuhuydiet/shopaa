import prisma from "../prisma"


export default {

  getKey: async (keyName: string) => {
    return await prisma.key.findUnique({
      where: { name: keyName }
    });
  }

}