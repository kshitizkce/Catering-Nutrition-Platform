namespace CateringNutrition.API.Dtos.vendorDto
{
    public class PagedResultDto<T>
    {
        public List<T> Data { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
