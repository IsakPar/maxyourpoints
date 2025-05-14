const styles = {
  container: {
    width: "100%",
    maxWidth: "1440px",
    padding: "7rem 4rem",
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "5rem",
    overflow: "hidden",
    backgroundColor: "rgb(240, 253, 244)", // emerald-50
  },
  header: {
    width: "100%",
    maxWidth: "768px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "1rem",
  },
  labelContainer: {
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "1rem",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    lineHeight: "normal",
  },
  titleContainer: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1.5rem",
  },
  title: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "3rem",
    fontWeight: "bold",
    lineHeight: "3.6rem",
    margin: 0,
  },
  subtitle: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    color: "#1C1917", // stone-950
    fontSize: "1.125rem",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    lineHeight: "1.75",
    margin: 0,
  },
  postsContainer: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "3rem",
  },
  postsRow: {
    alignSelf: "stretch",
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "4rem",
  },
  viewAllContainer: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: "1rem",
  },
}

export default styles
