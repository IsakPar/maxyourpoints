const styles = {
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "2rem",
  },
  image: {
    flex: 1,
    height: "16rem",
    objectFit: "cover",
    borderRadius: "0.5rem",
  },
  content: {
    flex: 1,
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "1.5rem",
  },
  metaContainer: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "1rem",
  },
  metaInfo: {
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem",
  },
  readTime: {
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "0.875rem",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    lineHeight: "1.25",
  },
  titleContainer: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "0.5rem",
  },
  title: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "1.5rem",
    fontWeight: "bold",
    lineHeight: "2",
    margin: 0,
  },
  summary: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "1rem",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    lineHeight: "normal",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  readMoreLink: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.75rem",
    textDecoration: "none",
    color: "#1C1917", // stone-950
    transition: "color 0.2s ease",
  },
  readMoreText: {
    justifyContent: "flex-start",
    fontSize: "1rem",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    lineHeight: "normal",
  },
}

export default styles
