import prisma from "../../models"


export default {

  getKey: async (keyName: string) => {
    return await prisma.key.findUnique({
      where: { name: keyName }
    });
  }

}