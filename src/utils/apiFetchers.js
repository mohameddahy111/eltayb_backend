
export default  class ApiFeatures {
  constructor(mongooesQuery, queryString) {
    this.mongooesQuery = mongooesQuery;
    this.queryString = queryString;
  }
  pagination(pages) {
    let page = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) page = 1;
    let skip = (page - 1) * 16;
    this.page ={
      page,
      perPage : page== 1? 1:page -1,
      nextPage :page+1 >pages ? pages :page+1,
      pages:pages
      

    }
    this.mongooesQuery.skip(skip).limit(16);
    return this;
  }
  filter() {
    let filterObj = { ...this.queryString };
    let excuteObj = ["page", "sort", "keyword", "fields"];
    excuteObj.forEach((x) => {
      delete filterObj[x];
    });
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/\bgt|gte|lte|lt\b/g, (match) => `$${match}`);
    filterObj = JSON.parse(filterObj);

    this.mongooesQuery.find(filterObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooesQuery.sort(sortBy);
    }
    return this;
  }
  search() {
    if (this.queryString.keyword) {
      this.mongooesQuery.find({
        $or: [{ title: { $regex: this.queryString.keyword, $options: "i" } }],
      });
    }
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      let fieldsBy = this.queryString.fields.split(",").join(" ");
      this.mongooesQuery.select(fieldsBy);
    }
    return this;
  }

}
