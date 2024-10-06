import prisma from '@/lib/prisma';
class PrismaKit {
  contructor() {}

  static checkUsernameAvailability = async (
    username: string
  ): Promise<boolean> => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user ? false : true;
  };
  static checkEmailAvailability = async (email: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user ? false : true;
  };
}
export default PrismaKit;
