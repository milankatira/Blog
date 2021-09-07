import "./header.css";

export default function Header() {
  return (
    <div className="header">

      <img
        className="headerImg"
        src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
        alt=""
      />
      <div className="headerTitles">

        <span className="headerTitleLg">Write your thoughts here</span>
      </div>
    </div>
  );
}
