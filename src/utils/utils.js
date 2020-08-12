export const sortDate = (data) =>{
  const sortDate = [...data];
  sortDate.sort((a,b) => {
    if(a.cases>b.cases){
      return -1;
    }else{
      return 1;
    }
  })
  return sortDate;
}