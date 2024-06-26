import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MothsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  try {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1 // Lấy ngày đầu tiên của tháng
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0 // Lấy ngày cuối cùng của tháng
      );

      const monthYear = startDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const result = await model.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

      const count = result.length > 0 ? result[0].count : 0;

      last12Months.unshift({ month: monthYear, count });
    }

    return { last12Months };
  } catch (error) {
    console.error("Error in generateLast12MothsData:", error);
    throw error; 
  }
}
