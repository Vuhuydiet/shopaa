import prisma from "../../../models";


class Transportation {

  static async getProviderByKey(key: string) {
    return await prisma.transportationProvider.findUnique({
      where: { accessKey: key }
    });
  }

}

export default Transportation;