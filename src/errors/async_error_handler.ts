export default async function asyncErrorHandler<T>(
  asyncFunction: () => Promise<T>
): Promise<T | null> {
  try {
    return await asyncFunction();
  } catch (error) {
    console.error("Error finding random creators:", error);
    return null;
  }
}
