const selectBookList = `
SELECT no
         , name
         , writer
         , publisher
         , publication_date
         , info 
FROM t_book_01
 ORDER BY no
`;
module.exports = {
    selectBookList,
};