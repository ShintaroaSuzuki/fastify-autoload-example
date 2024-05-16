/* eslint-disable 
 functional/no-return-void, 
 functional/no-loop-statements, 
 functional/no-conditional-statements,
 functional/immutable-data,
 functional/no-expression-statements,
 functional/functional-parameters,
 @typescript-eslint/no-explicit-any
 */
import { PrismaClient } from "@prisma/client";

// オフセット時間を設定するヘルパー関数
const setOffsetTime = (object: any, offsetTime: number) => {
  if (object === null || typeof object !== "object") return;

  for (const key of Object.keys(object)) {
    const value = object[key];
    if (value instanceof Date) {
      object[key] = new Date(value.getTime() + offsetTime);
    } else if (value !== null && typeof value === "object") {
      setOffsetTime(value, offsetTime);
    }
  }
};

// UTCの時間をJSTに変換(+09:00)してDBに保存、またレコード取得時にも時差を補正(-09:00)
const adjustTimeExtension = (prisma: PrismaClient) => {
  const offsetTime = 9 * 60 * 60 * 1000; // JSTのオフセット時間(UTC+09:00)

  return prisma.$extends({
    query: {
      $allOperations: async ({ args, query }) => {
        // DBへの保存時にUTCからJSTに変換
        setOffsetTime(args, offsetTime);

        const result = await query(args);

        // DBからの取得時にJSTからUTCに変換
        setOffsetTime(result, -offsetTime);

        return result;
      },
    },
  });
};

// prismaインスタンスをadjustTimeでラップ
const prisma = adjustTimeExtension(new PrismaClient());

export { prisma, PrismaClient as Prisma };
