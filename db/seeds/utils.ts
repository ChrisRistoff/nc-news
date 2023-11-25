export const convertTimestampToDate = ({ created_at, ...otherProperties }: any) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

export const createRef = (arr: any[], key: string | number, value: string | number) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

export const formatComments = (comments: any, idLookup: any) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...convertTimestampToDate(restOfComment),
    };
  });
};
