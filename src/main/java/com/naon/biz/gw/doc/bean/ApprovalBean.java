package com.naon.biz.gw.doc.bean;

// TODO: Auto-generated Javadoc
/**
 * The Class ApprovalBean.
 *
 * @author 안요한(ayh0912@naonsoft.com)
 */
public class ApprovalBean {

	/** 승인 상태 */
	public static final String APPROVAL_FLAG = "A";
	
	/** 거절 상태 */
	public static final String REJECT_FLAG = "R";

	/** 승인 일렬번호 */
	private long   apprSeq;
	
	/** 게시물 일렬번호 */
	private String atclNo;
	
	/** 승인 반려구분 */
	private String flag;
	
	/** 반려 사유 내용 */
	private String rejectWhyDesc;
	
	/** 등록일시 */
	private String regDate;

	/**
	 * Gets the atcl no.
	 *
	 * @return the atcl no
	 */
	public String getAtclNo() {
		return atclNo;
	}

	/**
	 * Sets the atcl no.
	 *
	 * @param atclNo the new atcl no
	 */
	public void setAtclNo(String atclNo) {
		this.atclNo = atclNo;
	}

	/**
	 * Gets the flag.
	 *
	 * @return the flag
	 */
	public String getFlag() {
		return flag;
	}

	/**
	 * Gets the appr seq.
	 *
	 * @return the appr seq
	 */
	public long getApprSeq() {
		return apprSeq;
	}

	/**
	 * Sets the appr seq.
	 *
	 * @param apprSeq the new appr seq
	 */
	public void setApprSeq(long apprSeq) {
		this.apprSeq = apprSeq;
	}

	/**
	 * Sets the flag.
	 *
	 * @param flag the new flag
	 */
	public void setFlag(String flag) {
		this.flag = flag;
	}

	/**
	 * Gets the reject why desc.
	 *
	 * @return the reject why desc
	 */
	public String getRejectWhyDesc() {
		return rejectWhyDesc;
	}

	/**
	 * Sets the reject why desc.
	 *
	 * @param rejectWhyDesc the new reject why desc
	 */
	public void setRejectWhyDesc(String rejectWhyDesc) {
		this.rejectWhyDesc = rejectWhyDesc;
	}

	/**
	 * Gets the reg date.
	 *
	 * @return the reg date
	 */
	public String getRegDate() {
		return regDate;
	}

	/**
	 * Sets the reg date.
	 *
	 * @param regDate the new reg date
	 */
	public void setRegDate(String regDate) {
		this.regDate = regDate;
	}

}
