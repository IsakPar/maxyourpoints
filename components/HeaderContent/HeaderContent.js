const styles = {
  container: {
    alignSelf: "stretch",
    padding: "5rem 4rem",
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "5rem",
    overflow: "hidden",
  },
  titleContainer: {
    flex: 1,
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "3.75rem",
    lineHeight: "67.2px",
  },
  descriptionContainer: {
    flex: 1,
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "2rem",
  },
  description: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "1.125rem",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    lineHeight: "1.5",
  },
}

export default styles
